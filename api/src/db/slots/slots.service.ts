import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Slots } from "./slots.entity";
import { EntityManager, IsNull, Repository } from "typeorm";
import { SlotDomainInterface, SlotsInterface } from "./interfaces/slots.interfaces";
import { SlotsMapper } from "./slots.mapper";

@Injectable()
export class SlotsServiceDb {
    constructor(@InjectRepository(Slots) private slotsRepository: Repository<Slots>) {

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
    async countConflictSlotByDateRange(startTime: string, endTime: string, tx?: EntityManager): Promise<number> {
        if(!tx) {
            const data = await this.slotsRepository
                .createQueryBuilder("s")
                .select("*")
                .where("s.startTime >= :startTime AND s.endTime <= :endTime", { startTime: startTime, endTime: endTime })
                .orWhere("s.startTime <= :startTime AND s.endTime >= :endTime", { startTime: startTime, endTime: endTime })
                .orWhere("s.startTime >= :startTime AND s.endTime <= :endTime", { startTime: startTime, endTime: endTime })
                .orWhere("s.startTime <= :endTime AND s.endTime >= :endTime", { startTime: startTime, endTime: endTime })
                .getCount();

            return data;
        }
        return await tx.getRepository(Slots)
            .createQueryBuilder("s")
            .select("*")
            .where("s.startTime >= :startTime AND s.endTime <= :endTime", { startTime: startTime, endTime: endTime })
            .orWhere("s.startTime <= :startTime AND s.endTime >= :endTime", { startTime: startTime, endTime: endTime })
            .orWhere("s.startTime >= :startTime AND s.endTime <= :endTime", { startTime: startTime, endTime: endTime })
            .orWhere("s.startTime <= :endTime AND s.endTime >= :endTime", { startTime: startTime, endTime: endTime })
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

