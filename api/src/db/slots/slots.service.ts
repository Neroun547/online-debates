import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Slots } from "./slots.entity";
import { Repository } from "typeorm";
import { SlotsInterface } from "./interfaces/slots.interfaces";
import { SlotsMapper } from "./slots.mapper";

@Injectable()
export class SlotsServiceDb {
    constructor(@InjectRepository(Slots) private slotsRepository: Repository<Slots>) {

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

