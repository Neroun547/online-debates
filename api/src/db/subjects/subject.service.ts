import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Subject } from "./subject.entity";
import { EntityManager, Repository } from "typeorm";
import {
    SubjectDomainInterface,
    SubjectInterface,
} from "./interfaces/subject.interfaces";
import { SubjectMapper } from "./subject.mapper";
import { SlotsLockMapper } from "../slots-lock/slots-lock.mapper";

@Injectable()
export class SubjectServiceDb {
    constructor(
        @InjectRepository(Subject) private repository: Repository<Subject>,
        private em: EntityManager,
    ) {}

    async findWithUserAndCategory(
        page: number,
        limit: number,
    ): Promise<SubjectDomainInterface[]> {
        const data = await this.repository.find({
            skip: (page - 1) * limit,
            take: limit,
            relations: { user: true, category: true },
        });

        return data.map((item) => SubjectMapper.toDomain(item));
    }
    async deleteByCategoryIdAndId(
        id: number,
        categoryId: number,
    ): Promise<void> {
        await this.repository.delete({ id: id, categoryId: categoryId });
    }
    async findByIdWithCategoryAndUser(
        id: number,
    ): Promise<SubjectDomainInterface | null> {
        const data = await this.repository.findOne({
            where: { id: id },
            relations: { user: true, category: true },
        });

        if (!data) {
            return null;
        }
        return SubjectMapper.toDomain(data);
    }
    async countByCategoryIdAndId(
        categoryId: number,
        subjectId: number,
    ): Promise<number> {
        return await this.repository.count({
            where: { categoryId: categoryId, id: subjectId },
        });
    }
    async countAll(): Promise<number> {
        return await this.repository.count();
    }
    async countByCategoryIdAndUserId(
        userId: number,
        categoryId: number,
    ): Promise<number> {
        return await this.repository.count({
            where: { userId: userId, categoryId: categoryId },
        });
    }
    async countByCategoryId(categoryId: number): Promise<number> {
        return await this.repository.count({
            where: { categoryId: categoryId },
        });
    }
    async countByUserId(userId: number): Promise<number> {
        return await this.repository.count({ where: { userId: userId } });
    }
    async deleteByIdAndUserId(id: number, userId: number): Promise<void> {
        await this.repository.delete({ id: id, userId: userId });
    }
    save(data: SubjectInterface) {
        return this.em.transaction("READ COMMITTED", async (tx) => {
            const subjectModel = SubjectMapper.toSave(data);
            const savedSubject = await tx.save(subjectModel);

            const slotsLockModel = SlotsLockMapper.toSave({
                userId: data.userId,
                subjectId: savedSubject.id,
            });
            await tx.save(slotsLockModel);
        });
    }
    async saveWithoutLock(data: SubjectInterface) {
        const model = SubjectMapper.toSave(data);

        await this.repository.save(model);
    }
    async findWithCategoryAndUserByCategoryIdAndUserId(
        page: number,
        limit: number,
        categoryId?: number,
        userId?: number,
    ): Promise<SubjectDomainInterface[]> {
        const data = await this.repository.find({
            relations: {
                category: true,
                user: true,
            },
            where: {
                categoryId: categoryId,
                userId: userId,
            },
            take: limit,
            skip: (page - 1) * limit,
        });

        return data.map((item) => SubjectMapper.toDomain(item));
    }
    async findById(id: number): Promise<SubjectDomainInterface | null> {
        const data = await this.repository.findOne({ where: { id: id } });

        if (!data) {
            return null;
        }
        return SubjectMapper.toDomain(data);
    }
    async countByUserIdAndId(id: number, userId: number): Promise<number> {
        return await this.repository.count({
            where: { id: id, userId: userId },
        });
    }
    async updateByCategoryIdUserIdAndId(
        id: number,
        userId: number,
        data: SubjectInterface,
    ): Promise<void> {
        await this.repository.update({ id: id, userId: userId }, data);
    }
    async updateById(id: number, data: SubjectInterface) {
        await this.repository.update({ id: id }, data);
    }
}
