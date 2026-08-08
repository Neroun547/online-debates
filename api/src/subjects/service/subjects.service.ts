import { Injectable, NotFoundException } from "@nestjs/common";
import { CategoryServiceDb } from "src/db/category/category.service";
import { SubjectServiceDb } from "src/db/subjects/subject.service";
import { UpdateSubjectDto } from "../dto/update-subject.dto";
import { GetByCategoryIdWithCategoryAndUserResponseDto } from "../dto/get-by-category-id-with-category-and-user-response.dto";

@Injectable()
export class SubjectsService {
    constructor(
        private subjectsServiceDb: SubjectServiceDb,
        private categoryServiceDb: CategoryServiceDb
    ) {}

    async getByCategoryIdWithCategoryAndUser(params: {
        page: number; 
        limit: number; 
        categoryId?: number;
        userId?: number;
    }): Promise<GetByCategoryIdWithCategoryAndUserResponseDto> {
        const currentSkipElements = params.page * params.limit;
        const countByCategory = await this.getCountByCategoryIdAndUserId(params.categoryId, params.userId);
        const data = await this.subjectsServiceDb.findWithCategoryAndUserByCategoryIdAndUserId(params.page, params.limit, params.categoryId, params.userId);

        return {
            data: data,
            isLoadMoreAvailable: countByCategory > currentSkipElements
        }
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

    private async getCountByCategoryIdAndUserId(categoryId: number | undefined, userId: number | undefined): Promise<number> {
        if(categoryId !== undefined && userId !== undefined) {
            return await this.subjectsServiceDb.countByCategoryIdAndUserId(userId, categoryId);
        } else if(categoryId !== undefined) {
            return await this.subjectsServiceDb.countByCategoryId(categoryId);
        } else if(userId !== undefined) {
            return await this.subjectsServiceDb.countByUserId(userId);
        } else {
            return await this.subjectsServiceDb.countAll();
        }
    }
}

