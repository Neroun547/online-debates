import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Subject } from "./subject.entity";
import { Repository } from "typeorm";
import { SubjectDomainInterface, SubjectInterface } from "./interfaces/subject.interfaces";
import { SubjectMapper } from "./subject.mapper";

@Injectable()
export class SubjectServiceDb {
    constructor(@InjectRepository(Subject) private repository: Repository<Subject>) {}

    async deleteByIdAndUserId(id: number, userId: number): Promise<void> {
        await this.repository.delete({ id: id, userId: userId });
    }
    async save(data: SubjectInterface) {
        const model = SubjectMapper.toSave(data);

        await this.repository.save(model);
    }    
    async findWithCategoryAndUserByCategoryId(page: number, limit: number, categoryId: number): Promise<SubjectDomainInterface[]> {
        const data = await this.repository.find({ 
            relations: {
                category: true,
                user: true
            },
            where: { 
                categoryId: categoryId 
            }, 
            take: limit, 
            skip: (page - 1) * limit
        });

        return data.map(item => SubjectMapper.toDomain(item));
    }
    async findById(id: number): Promise<SubjectDomainInterface | null> {
        const data = await this.repository.findOne({ where: { id: id } });

        if(!data) {
            return null;
        }
        return SubjectMapper.toDomain(data);
    }
    async countByUserIdAndId(id: number, userId: number): Promise<number> {
        return await this.repository.count({ where: { id: id, userId: userId } });
    }
    async updateByCategoryIdUserIdAndId(id: number, userId: number, data: SubjectInterface): Promise<void> {
        await this.repository.update({ id: id, userId: userId }, data);
    }
}

