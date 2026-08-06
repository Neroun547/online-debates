import { Injectable, NotFoundException } from "@nestjs/common";
import { CategoryServiceDb } from "src/db/category/category.service";
import { SubjectDomainInterface } from "src/db/subjects/interfaces/subject.interfaces";
import { SubjectServiceDb } from "src/db/subjects/subject.service";
import { UpdateSubjectDto } from "../dto/update-subject.dto";

@Injectable()
export class SubjectsService {
    constructor(
        private subjectsServiceDb: SubjectServiceDb,
        private categoryServiceDb: CategoryServiceDb
    ) {}

    async getByCategoryIdWithCategoryAndUser(page: number, limit: number, categoryId: number): Promise<SubjectDomainInterface[]> {
        return await this.subjectsServiceDb.findWithCategoryAndUserByCategoryId(page, limit, categoryId);
    }
    async createSubject(name: string, categoryId: number, userId: number) {
        const categoryInDb = await this.categoryServiceDb.findById(categoryId);

        if(!categoryInDb) {
            throw new NotFoundException({ message: "Category not found" });
        }
        await this.subjectsServiceDb.save({
            name: name,
            categoryId: categoryId,
            userId: userId
        });
    }
    async updateSubjectByCategoryIdAndUserId(userId: number, categoryId: number, subjectId: number, data: UpdateSubjectDto) {
        const countInDb = await this.subjectsServiceDb.countByUserIdAndId(subjectId, userId);

        if(countInDb <= 0) {
            throw new NotFoundException({ message: "Subject not found" });
        }
        const categoryCountInDb = await this.categoryServiceDb.countById(categoryId);
        
        if(categoryCountInDb <= 0) {
            throw new NotFoundException({ message: "Category not found" });
        }
        await this.subjectsServiceDb.updateByCategoryIdUserIdAndId(
            subjectId,
            userId, 
            {
                name: data.name,
                categoryId: categoryId,
                userId: userId
            }
        );
    }
    async deleteSubjectById(id: number, userId: number) {
        const countInDb = await this.subjectsServiceDb.countByUserIdAndId(id, userId);

        if(countInDb <= 0) {
            throw new NotFoundException({ message: "Subject not found" });
        }
        await this.subjectsServiceDb.deleteByIdAndUserId(id, userId);
    }
}

