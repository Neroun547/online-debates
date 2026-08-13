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
import { User } from "../user/user.entity";

@Injectable()
export class SlotsServiceDb {
    constructor(
        @InjectRepository(Slots) private slotsRepository: Repository<Slots>,
        private em: EntityManager
    ) {

    }
    generateNewSlots(dateTo: string) {
        return this.em.transaction("READ COMMITTED", async (tx) => {
            const currentDate = new Date();

            const allTemplates = await tx.find(SlotsTemplates, {});
            const dateToMillis = DateTime.fromFormat(dateTo, "yyyy-MM-dd").toMillis();
            
            let currentDateTmp = currentDate;
            let currentDateTmpLuxon = DateTime.fromJSDate(currentDateTmp);
            let currentDateTmpMillis = DateTime.fromJSDate(currentDate).toMillis();

            while(currentDateTmpMillis < dateToMillis) {
                for(const template of allTemplates) {
                    const dateForSlot = getDateForSlot(template.weekday, currentDateTmpLuxon.weekday, currentDateTmp);

                    const dateStart = dateForSlot + " " + template.startTime;
                    const dateTo = dateForSlot + " " + template.endTime;
                    
                    const countConflicts = await this.countConflictSlotByDateRange(dateStart, dateTo, template.userId, template.subjectId, tx);

                    if(countConflicts <= 0) {
                        const model = SlotsMapper.toSave({
                            startTime: DateTime.fromFormat(dateStart, "yyyy-MM-dd HH:mm").toJSDate(),
                            endTime: DateTime.fromFormat(dateTo, "yyyy-MM-dd HH:mm").toJSDate(),
                            userId: template.userId,
                            subjectId: template.subjectId,
                            slotsTemplateId: template.id
                        });
                        await tx.save(model);
                        await tx.update(SlotsTemplates, { id: template.id }, { lastSlotCreation: new Date() });
                    }
                }
                const nextWeekLuxon = DateTime.fromJSDate(currentDateTmp).plus({ weeks: 1 });

                currentDateTmp = nextWeekLuxon.toJSDate();
                currentDateTmpMillis = nextWeekLuxon.toMillis();
            }
        });
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
    saveSingleSlot(data: CreateSingleSlotInterface) {
        return this.em.transaction("READ COMMITTED", async (tx) => {
            await tx.createQueryBuilder(User, "user")
                .setLock('pessimistic_write')
                .where("user.id = :userId", { userId: data.userId })
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

