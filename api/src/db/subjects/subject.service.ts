import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Subject } from "./subject.entity";
import { Repository } from "typeorm";
import { SubjectDomainInterface, SubjectInterface } from "./interfaces/subject.interfaces";
import { SubjectMapper } from "./subject.mapper";

@Injectable()
export class SubjectServiceDb {
    constructor(@InjectRepository(Subject) private repository: Repository<Subject>) {}

    async countByCategoryIdAndId(categoryId: number, subjectId: number): Promise<number> {
        return await this.repository.count({ where: { categoryId: categoryId, id: subjectId } });
    }
    async countAll(): Promise<number> {
        return await this.repository.count();
    }
    async countByCategoryIdAndUserId(userId: number, categoryId: number): Promise<number> {
        return await this.repository.count({ where: { userId: userId, categoryId: categoryId } });
    }
    async countByCategoryId(categoryId: number): Promise<number> {
        return await this.repository.count({ where: { categoryId: categoryId } });
    }
    async countByUserId(userId: number): Promise<number> {
        return await this.repository.count({ where: { userId: userId } });
    }
    async deleteByIdAndUserId(id: number, userId: number): Promise<void> {
        await this.repository.delete({ id: id, userId: userId });
    }
    async save(data: SubjectInterface) {
        const model = SubjectMapper.toSave(data);

        await this.repository.save(model);
    }    
    async findWithCategoryAndUserByCategoryIdAndUserId(page: number, limit: number, categoryId?: number, userId?: number): Promise<SubjectDomainInterface[]> {
        const data = await this.repository.find({ 
            relations: {
                category: true,
                user: true
            },
            where: { 
                categoryId: categoryId,
                userId: userId
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

