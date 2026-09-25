import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { CategoriesTranslates } from "./categories-translates.entity";
import { CategoriesTranslatesSaveInterface } from "./interfaces/categories-translates.interfaces";
import { CategoriesTranslatesMapper } from "./categories-translates.mapper";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class CategoriesTranslatesServiceDb {
    constructor(@InjectRepository(CategoriesTranslates) private repository: Repository<CategoriesTranslates>) {}

    async save(data: CategoriesTranslatesSaveInterface) {
        const model = CategoriesTranslatesMapper.toSave(data);

        await this.repository.insert(model);
    }
    async saveMany(data: Array<CategoriesTranslatesSaveInterface>) {
        for(const item of data) {
            const model = CategoriesTranslatesMapper.toSave(item);

            await this.repository.save(model);
        }
    }
    async upsertMany(data: Array<CategoriesTranslatesSaveInterface>) {
        for(const item of data) {
            const model = CategoriesTranslatesMapper.toSave(item);

            const translateInDb = await this.repository.findOne({ where: { categoryId: model.categoryId, property: model.property, language: model.language } });

            if(translateInDb) {
                await this.repository.update({ id: translateInDb.id }, model);
            } else {
                await this.repository.save(model);
            }
        }
    }
}

