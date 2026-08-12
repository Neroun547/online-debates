import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Slots } from "./slots.entity";
import { EntityManager, IsNull, Repository } from "typeorm";
import { SlotDomainInterface, SlotsInterface } from "./interfaces/slots.interfaces";
import { SlotsMapper } from "./slots.mapper";
import { SessionsStatus } from "../sessions/sessions.entity";

@Injectable()
export class SlotsServiceDb {
    constructor(@InjectRepository(Slots) private slotsRepository: Repository<Slots>) {

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
    async countConflictSlotByDateRange(startTime: string, endTime: string, userId: number, tx?: EntityManager): Promise<number> {
        if(!tx) {
            const data = await this.slotsRepository
                .createQueryBuilder("s")
                .select("*")
                .where({ userId: userId })
                .andWhere("s.startTime >= :startTime AND s.endTime <= :endTime", { startTime: startTime, endTime: endTime })
                .orWhere("s.startTime <= :startTime AND s.endTime >= :endTime", { startTime: startTime, endTime: endTime })
                .orWhere("s.startTime <= :endTime AND s.endTime >= :endTime", { endTime: endTime })
                .orWhere("s.startTime <= :startTime AND s.endTime <= :endTime AND s.endTime >= :startTime", { startTime: startTime, endTime: endTime })
                .getCount();

            return data;
        }
        return await tx.getRepository(Slots)
            .createQueryBuilder("s")
            .select("*")
            .where({ userId: userId })
            .andWhere("s.startTime >= :startTime AND s.endTime <= :endTime", { startTime: startTime, endTime: endTime })
            .orWhere("s.startTime <= :startTime AND s.endTime >= :endTime", { startTime: startTime, endTime: endTime })
            .orWhere("s.startTime <= :endTime AND s.endTime >= :endTime", { endTime: endTime })
            .orWhere("s.startTime <= :startTime AND s.endTime <= :endTime AND s.endTime >= :startTime", { startTime: startTime, endTime: endTime })
            .getCount();
    }
    async save(data: SlotsInterface) {
        const model = SlotsMapper.toSave(data);

        await this.slotsRepository.save(model);
    }

    async saveMany(data: SlotsInterface[]) {
        const modelsArr = data.map(item => SlotsMapper.toSave(item));

        await this.slotsRepository.insert(modelsArr);
    }
}

