import { Injectable, NotFoundException } from "@nestjs/common";
import { CategoryServiceDb } from "src/db/category/category.service";
import { CategoryDomainInterface, CategoryInterface } from "src/db/category/interfaces/category.interfaces";
import { UpdateCategoryDto } from "../dto/update-category.dto";
import { GetCategoriesResponseDto } from "../dto/get-categories-response.dto";

@Injectable()
export class CategoriesService {
    constructor(private categoriesServiceDb: CategoryServiceDb) {}

    async getCategoryById(id: number): Promise<CategoryDomainInterface | null> {
        return await this.categoriesServiceDb.findById(id);
    }
    async getWithPagination(page: number, limit: number): Promise<GetCategoriesResponseDto> {
        const currentSkipElements = page * limit;
        const count = await this.categoriesServiceDb.countAll();
        const data = await this.categoriesServiceDb.find(page, limit);

        return {
            data: data,
            isLoadMoreAvailable: count > currentSkipElements
        }
    }
    async getWithPaginationForAdmin(page: number, limit: number) {
        const data = await this.categoriesServiceDb.findWithSubjects(page, limit);
        const count = await this.categoriesServiceDb.countAll();

        return {
            data: data,
            count: count
        }
    }
    async saveCategory(body: CategoryInterface) {
        await this.categoriesServiceDb.save(body);
    }
    async deleteCategoryById(id: number) {
        const categoryInDb = await this.categoriesServiceDb.findById(id);

        if(!categoryInDb) {
            throw new NotFoundException({ message: "Category not found" });
        }
        await this.categoriesServiceDb.deleteById(id);
    }
    async updateById(id: number, body: UpdateCategoryDto) {
        const categoryInDb = await this.categoriesServiceDb.findById(id);

        if(!categoryInDb) {
            throw new NotFoundException({ message: "Category not found" });
        }
        await this.categoriesServiceDb.updateById(id, body);
    }
}

