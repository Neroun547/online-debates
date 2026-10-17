import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Support } from "./support.entity";
import { Repository } from "typeorm";
import {
    SupportDomainInterface,
    SupportInterface,
} from "./interfaces/support.interfaces";
import { SupportMapper } from "./support.mapper";

@Injectable()
export class SupportServiceDb {
    constructor(
        @InjectRepository(Support) private repository: Repository<Support>,
    ) {}

    async save(data: SupportInterface): Promise<void> {
        const model = SupportMapper.toSave(data);

        await this.repository.save(model);
    }

    async find(page: number, limit: number): Promise<SupportDomainInterface[]> {
        const data = await this.repository.find({
            take: limit,
            skip: (page - 1) * limit,
        });

        return data.map((item) => SupportMapper.toDomain(item));
    }
    async countAll(): Promise<number> {
        return await this.repository.count();
    }
}
