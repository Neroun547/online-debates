import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Category } from "./category.entity";
import { CategoryDomainInterface, CategoryInterface } from "./interfaces/category.interfaces";
import { CategoryMapper } from "./category.mapper";
import { InjectRepository } from "@nestjs/typeorm";

@Injectable()
export class CategoryServiceDb {
    constructor(@InjectRepository(Category) private repository: Repository<Category>) {}

    async countAll(): Promise<number> {
        return await this.repository.count();
    }
    async countById(id: number): Promise<number> {
        return await this.repository.count({ where: { id: id } });
    }
    async findById(id: number): Promise<CategoryDomainInterface | null> {
        const data = await this.repository.findOne({ where: { id: id } });

        if(!data) {
            return null;
        }
        return CategoryMapper.toDomain(data);
    }
    async save(data: CategoryInterface): Promise<void> {
        const model = CategoryMapper.toSave(data);

        await this.repository.save(model);
    }
    async find(page: number, limit: number) {
        const data = await this.repository.find({ where: {}, order: { priority: "ASC" }, take: limit, skip: (page - 1) * limit });

        return data.map(item => CategoryMapper.toDomain(item));
    }
    async findWithSubjectsAndSearchByName(page: number, limit: number, searchName?: string): Promise<CategoryDomainInterface[]> {
        if(!searchName) {
            const data = await this.repository.find({ where: {}, order: { priority: "ASC" }, take: limit, skip: (page - 1) * limit, relations: { subjects: true } });

            return data.map(item => CategoryMapper.toDomain(item));
        } else {
            const data = await this.repository
                .createQueryBuilder("category")
                .leftJoinAndSelect("category.subjects", "subjects")
                .offset((page - 1) * limit)
                .limit(limit)
                .where("category.name LIKE :searchName", { searchName: "%" + searchName + "%" })
                .getMany();

            return data.map(item => CategoryMapper.toDomain(item));
        }
    }
    async updateById(id: number, data: CategoryInterface): Promise<void> {
        await this.repository.update({ id: id }, data);
    }
    async deleteById(id: number): Promise<void> {
        await this.repository.delete({ id: id });
    }
}

