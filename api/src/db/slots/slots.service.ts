import { ConflictException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Slots } from "./slots.entity";
import { EntityManager, IsNull, Repository } from "typeorm";
import { CreateSingleSlotInterface, SlotDomainInterface, SlotsInterface } from "./interfaces/slots.interfaces";
import { SlotsMapper } from "./slots.mapper";
import { SessionsStatus } from "../sessions/sessions.entity";
import { SlotsTemplates } from "../slots-templates/slots-templates.entity";
import { DateTime } from "luxon";
import { getDateForSlot } from "src/slots/utils/utils";
import { SlotsLock } from "../slots-lock/slots-lock.entity";
import { SlotsLockMapper } from "../slots-lock/slots-lock.mapper";

@Injectable()
export class SlotsServiceDb {
    constructor(
        @InjectRepository(Slots) private slotsRepository: Repository<Slots>,
        private em: EntityManager
    ) {

    }
    async generateNewSlots(dateTo: string): Promise<void> {
        const currentDate = DateTime.now().startOf("day");
        const generationEndDate = DateTime.fromFormat(dateTo, "yyyy-MM-dd").startOf("day");
        const templateOwners = await this.em
            .createQueryBuilder(SlotsTemplates, "template")
            .select("template.userId", "userId")
            .addSelect("template.subjectId", "subjectId")
            .distinct(true)
            .orderBy("template.userId", "ASC")
            .addOrderBy("template.subjectId", "ASC")
            .getRawMany<{ userId: number; subjectId: number }>();

        for(const templateOwner of templateOwners) {
            const userId = Number(templateOwner.userId);
            const subjectId = Number(templateOwner.subjectId);

            await this.em.transaction("READ COMMITTED", async (tx) => {
                await tx
                    .createQueryBuilder()
                    .insert()
                    .into(SlotsLock)
                    .values({ userId: userId, subjectId: subjectId })
                    .orIgnore()
                    .execute();

                await tx
                    .createQueryBuilder(SlotsLock, "slotsLock")
                    .setLock("pessimistic_write")
                    .where("slotsLock.userId = :userId AND slotsLock.subjectId = :subjectId", { userId: userId, subjectId: subjectId })
                    .getOneOrFail();

                const templates = await tx.find(SlotsTemplates, {
                    where: { userId: userId, subjectId: subjectId }
                });

                for(const template of templates) {
                    const firstSlotDate = getDateForSlot(
                        template.weekday,
                        currentDate.weekday,
                        currentDate.toJSDate()
                    );

                    if(!firstSlotDate) {
                        continue;
                    }
                    let slotDate = DateTime.fromFormat(firstSlotDate, "yyyy-MM-dd");
                    let isSlotCreated = false;

                    while(slotDate.toMillis() < generationEndDate.toMillis()) {
                        const slotDateString = slotDate.toFormat("yyyy-MM-dd");
                        const startTime = `${slotDateString} ${template.startTime}`;
                        const endTime = `${slotDateString} ${template.endTime}`;
                        const countConflicts = await this.countConflictSlotByDateRange(
                            startTime,
                            endTime,
                            userId,
                            subjectId,
                            tx
                        );

                        if(countConflicts <= 0) {
                            const model = SlotsMapper.toSave({
                                startTime: DateTime.fromFormat(startTime, "yyyy-MM-dd HH:mm").toJSDate(),
                                endTime: DateTime.fromFormat(endTime, "yyyy-MM-dd HH:mm").toJSDate(),
                                userId: userId,
                                subjectId: subjectId,
                                slotsTemplateId: template.id
                            });

                            await tx.save(model);
                            isSlotCreated = true;
                        }
                        slotDate = slotDate.plus({ weeks: 1 });
                    }

                    if(isSlotCreated) {
                        await tx.update(SlotsTemplates, { id: template.id }, { lastSlotCreation: new Date() });
                    }
                }
            });
        }
    }

    async deleteSlotsBeforeDate(date: string): Promise<void> {
        await this.slotsRepository
            .createQueryBuilder()
            .where("startTime <= :date", { date: date })
            .delete()
            .execute();
    }
    async findByIdWithUser(slotId: number): Promise<SlotDomainInterface | null> {
        const data = await this.slotsRepository.findOne({ where: { id: slotId }, relations: { user: true } });

        if(!data) {
            return null;
        }
        return SlotsMapper.toDomain(data);
    }
    async findForBooking(params: {
        dateFrom: string;
        dateTo: string;
        userId: number;
        subjectId: number;
    }): Promise<SlotDomainInterface[]> {
        const data = await this.slotsRepository
            .createQueryBuilder("s")
            .leftJoinAndSelect("s.session", "session")
            .where("s.userId = :userId", { userId: params.userId })
            .andWhere("s.subjectId = :subjectId", { subjectId: params.subjectId })
            .andWhere("s.startTime >= :startTime", { startTime: params.dateFrom })
            .andWhere("s.endTime <= :endTime", { endTime: params.dateTo })
            .andWhere("(session.id IS NULL OR session.status = :sessionStatus)", { sessionStatus: SessionsStatus.CANCELLED })
            .getMany();

        return data.map(slot => SlotsMapper.toDomain(slot));
    }
    async deleteSlotByUserIdAndId(userId: number, slotId: number): Promise<void> {
        await this.slotsRepository.delete({ userId: userId, id: slotId });
    }
    async findSingleSlotByUserIdAndSlotIdWithSession(userId: number, slotId: number): Promise<SlotDomainInterface | null> {
        const data = await this.slotsRepository
            .createQueryBuilder("s")
            .leftJoinAndSelect("s.session", "session")
            .where("s.id = :id", { id: slotId })
            .andWhere("s.userId = :userId", { userId: userId })
            .andWhere("s.slotsTemplateId IS NULL")
            .getOne();

        if(!data) {
            return null;
        }
        return SlotsMapper.toDomain(data);
    }
    async findSingleSlots(params: {
        userId: number;
        dateFrom: string;
        dateTo: string;
        subjectId: number;
        page: number;
        limit: number;
    }): Promise<SlotDomainInterface[]> {
        const data = await this.slotsRepository
            .createQueryBuilder("s")
            .where({ userId: params.userId, subjectId: params.subjectId, slotsTemplateId: IsNull() })
            .andWhere("s.startTime >= :startTime AND s.endTime <= :endTime", { startTime: params.dateFrom, endTime: params.dateTo })
            .offset((params.page - 1) * params.limit)
            .limit(params.limit)
            .getMany();

        return data.map(item => SlotsMapper.toDomain(item));
    }
    async getTotalSingleSlots(params: {
        userId: number;
        dateFrom: string;
        dateTo: string;
        subjectId: number;
    }): Promise<number> { 
        return await this.slotsRepository
            .createQueryBuilder("s")
            .where({ userId: params.userId, subjectId: params.subjectId, slotsTemplateId: IsNull() })
            .andWhere("s.startTime >= :startTime AND s.endTime <= :endTime", { startTime: params.dateFrom, endTime: params.dateTo })
            .getCount();
    }
    async countConflictSlotByDateRange(startTime: string, endTime: string, userId: number, subjectId: number, tx?: EntityManager): Promise<number> {
        if(!tx) {
            const data = await this.slotsRepository
                .createQueryBuilder("s")
                .select("*")
                .where("s.userId = :userId AND s.subjectId = :subjectId", { userId: userId, subjectId: subjectId })
                .andWhere("s.startTime >= :startTime AND s.endTime <= :endTime", { startTime: startTime, endTime: endTime })
                .orWhere("s.userId = :userId AND s.subjectId = :subjectId AND s.startTime <= :startTime AND s.endTime >= :endTime", { startTime: startTime, endTime: endTime, userId: userId, subjectId: subjectId })
                .orWhere("s.userId = :userId AND s.subjectId = :subjectId AND s.startTime <= :endTime AND s.endTime >= :endTime", { endTime: endTime, userId: userId, subjectId: subjectId })
                .orWhere("s.userId = :userId AND s.subjectId = :subjectId AND s.startTime <= :startTime AND s.endTime <= :endTime AND s.endTime >= :startTime", { startTime: startTime, endTime: endTime, userId: userId, subjectId: subjectId })
                .getCount();

            return data;
        }
        return await tx.getRepository(Slots)
            .createQueryBuilder("s")
            .select("*")
            .where("s.userId = :userId AND s.subjectId = :subjectId", { userId: userId, subjectId: subjectId })
            .andWhere("s.startTime >= :startTime AND s.endTime <= :endTime", { startTime: startTime, endTime: endTime })
            .orWhere("s.userId = :userId AND s.subjectId = :subjectId AND s.startTime <= :startTime AND s.endTime >= :endTime", { startTime: startTime, endTime: endTime, userId: userId, subjectId: subjectId })
            .orWhere("s.userId = :userId AND s.subjectId = :subjectId AND s.startTime <= :endTime AND s.endTime >= :endTime", { endTime: endTime, userId: userId, subjectId: subjectId })
            .orWhere("s.userId = :userId AND s.subjectId = :subjectId AND s.startTime <= :startTime AND s.endTime <= :endTime AND s.endTime >= :startTime", { startTime: startTime, endTime: endTime, userId: userId, subjectId: subjectId })
            .getCount();
    }
    async saveSingleSlot(data: CreateSingleSlotInterface) {
        const slotsLockInDb = await this.em.findOne(SlotsLock, { where: { userId: data.userId, subjectId: data.subjectId } });

        if(!slotsLockInDb) {
            const slotsLockModel = SlotsLockMapper.toSave({
                userId: data.userId,
                subjectId: data.subjectId
            });
            await this.em
                .createQueryBuilder()
                .insert()
                .into(SlotsLock)
                .values({ ...slotsLockModel })
                .orIgnore()
                .execute();
        }
        return this.em.transaction("READ COMMITTED", async (tx) => {
            await tx
                .createQueryBuilder(SlotsLock, "slotsLock")
                .setLock("pessimistic_write")
                .where("slotsLock.userId = :userId AND slotsLock.subjectId = :subjectId", { userId: data.userId, subjectId: data.subjectId })
                .getOneOrFail();
            
            const conflictsCount = await this.countConflictSlotByDateRange(data.startTime, data.endTime, data.userId, data.subjectId, tx);

            if(conflictsCount > 0) {
                throw new ConflictException({ message: "The selected time period overlaps with another slot" });
            }
            const model = SlotsMapper.toSave({
                startTime: DateTime.fromFormat(data.startTime, "yyyy-MM-dd HH:mm").toJSDate(),
                endTime: DateTime.fromFormat(data.endTime, "yyyy-MM-dd HH:mm").toJSDate(),
                userId: data.userId,
                subjectId: data.subjectId,
                slotsTemplateId: data.slotsTemplateId
            });
            await tx.save(model);
        });
    }

    async saveMany(data: SlotsInterface[]) {
        const modelsArr = data.map(item => SlotsMapper.toSave(item));

        await this.slotsRepository.insert(modelsArr);
    }
}
