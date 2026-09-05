import { Injectable, NotFoundException } from "@nestjs/common";
import { CategoryServiceDb } from "src/db/category/category.service";
import { SubjectServiceDb } from "src/db/subjects/subject.service";
import { UpdateSubjectDto } from "../dto/update-subject.dto";
import { GetByCategoryIdWithCategoryAndUserResponseDto } from "../dto/get-by-category-id-with-category-and-user-response.dto";
import { GetSubjectByIdWithCategoryAndUserResponseDto } from "../dto/get-subject-by-id-with-category-and-user-response.interface";
import { UserServiceDb } from "src/db/user/user.service";
import { UserDomainInterface } from "src/db/user/interfaces/user.interfaces";
import { AdminServiceDb } from "src/db/admin/admin.service";
import { GetSubjectsResponseDto } from "../dto/get-subjects-response.dto";
import { AdminUpdateSubjectDto } from "../dto/admin-update-subject.dto";

@Injectable()
export class SubjectsService {
    constructor(
        private subjectsServiceDb: SubjectServiceDb,
        private categoryServiceDb: CategoryServiceDb,
        private usersServiceDb: UserServiceDb,
        private adminServiceDb: AdminServiceDb
    ) {}

    async getUsersBySubjectId(subjectId: number, page: number, limit: number, userId: number) {
        const subjectInDb = await this.subjectsServiceDb.findById(subjectId);

        if(!subjectInDb) {
            throw new NotFoundException({ message: "Subject not found" });
        }
        const data = await this.usersServiceDb.findInSubject(subjectId, page, limit);

        return data.map((user: UserDomainInterface) => {
            if(user.id === userId) {
                return {
                    ...user,
                    isTheSameUser: true
                }
            }
            return user;
        });
    }
    async getSubjectWithUserAndCategoryById(id: number): Promise<GetSubjectByIdWithCategoryAndUserResponseDto> {
        const subjectInDb = await this.subjectsServiceDb.findByIdWithCategoryAndUser(id);

        if(!subjectInDb) {
            throw new NotFoundException({ message: "Subject not found" });
        }
        return subjectInDb;
    }
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
    async createSubject(name: string, categoryId: number, userId: number | null) {
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
    async adminCreateSubject(name: string, categoryId: number) {
        const categoryInDb = await this.categoryServiceDb.findById(categoryId);

        if(!categoryInDb) {
            throw new NotFoundException({ message: "Category not found" });
        }
        await this.subjectsServiceDb.saveWithoutLock({
            name: name,
            categoryId: categoryId,
            userId: null
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

    async deleteSubjectFromAdmin(params: {
        subjectId: number;
        categoryId: number;
        adminId: number;
    }) {
        const adminInDb = await this.adminServiceDb.findById(params.adminId);

        if(!adminInDb) {
            throw new NotFoundException({ message: "Admin not found" });
        }
        await this.subjectsServiceDb.deleteByCategoryIdAndId(params.subjectId, params.categoryId);
    }

    async getSubjects(params: {
        page: number,
        limit: number
    }): Promise<GetSubjectsResponseDto> {
        const subjects = await this.subjectsServiceDb.findWithUserAndCategory(params.page, params.limit);
        const countAll = await this.subjectsServiceDb.countAll();

        return {
            data: subjects,
            count: countAll
        }
    }

    async updateSubject(id: number, data: AdminUpdateSubjectDto) {
        const subjectInDb = await this.subjectsServiceDb.findById(id);

        if(!subjectInDb) {
            throw new NotFoundException({ message: "Subject not found" });
        }
        await this.subjectsServiceDb.updateById(subjectInDb.id, {
            name: data.name,
            categoryId: data.categoryId,
            userId: data.userId ? data.userId : null
        });
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

