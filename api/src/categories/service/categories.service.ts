import { Injectable, NotFoundException } from "@nestjs/common";
import { CategoryServiceDb } from "src/db/category/category.service";
import { CategoryDomainInterface, CategoryInterface } from "src/db/category/interfaces/category.interfaces";
import { UpdateCategoryDto } from "../dto/update-category.dto";

@Injectable()
export class CategoriesService {
    constructor(private categoriesServiceDb: CategoryServiceDb) {}

    async getWithPagination(page: number, limit: number): Promise<CategoryDomainInterface[]> {
        return await this.categoriesServiceDb.findWithPagination(page, limit);
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

