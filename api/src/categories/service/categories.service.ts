import { Injectable, NotFoundException } from "@nestjs/common";
import { CategoryServiceDb } from "src/db/category/category.service";
import { CategoryDomainInterface } from "src/db/category/interfaces/category.interfaces";
import { UpdateCategoryDto } from "../dto/update-category.dto";
import { GetCategoriesResponseDto } from "../dto/get-categories-response.dto";
import { SaveCategoryDto } from "../dto/save-category.dto";
import { CategoriesTranslatesServiceDb } from "src/db/translates/categories/categories-translates.service";
import { CategoriesTranslatesPropertyNames } from "src/db/translates/categories/categories-translates.entity";

@Injectable()
export class CategoriesService {
    constructor(
        private categoriesServiceDb: CategoryServiceDb,
        private categoriesTranslatesServiceDb: CategoriesTranslatesServiceDb
    ) {}

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
    async getWithPaginationForAdmin(page: number, limit: number, searchName?: string) {
        const data = await this.categoriesServiceDb.findWithSubjectsAndSearchByName(page, limit, searchName);
        const count = await this.categoriesServiceDb.countAll();

        return {
            data: data,
            count: count
        }
    }
    async saveCategory(body: SaveCategoryDto) {
        const savedData = await this.categoriesServiceDb.saveAndReturn({
            name: body.translateNameEn,
            priority: body.priority
        });

        await this.categoriesTranslatesServiceDb.saveMany([
            {
                property: CategoriesTranslatesPropertyNames.name,
                value: body.translateNameEn,
                categoryId: savedData.id,
                language: "en"
            },
            {
                property: CategoriesTranslatesPropertyNames.name,
                value: body.translateNameRu,
                categoryId: savedData.id,
                language: "ru"
            },
            {
                property: CategoriesTranslatesPropertyNames.name,
                value: body.translateNameUk,
                categoryId: savedData.id,
                language: "uk"
            }
        ]);
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
        await this.categoriesServiceDb.updateById(id, { priority: body.priority, name: body.translateNameEn });
        await this.categoriesTranslatesServiceDb.upsertMany([
            {
                property: CategoriesTranslatesPropertyNames.name,
                value: body.translateNameEn,
                categoryId: id,
                language: "en"
            },
            {
                property: CategoriesTranslatesPropertyNames.name,
                value: body.translateNameRu,
                categoryId: id,
                language: "ru"
            },
            {
                property: CategoriesTranslatesPropertyNames.name,
                value: body.translateNameUk,
                categoryId: id,
                language: "uk"
            }
        ]);      
    }
    async getTheMostPopularCategories(count: number): Promise<CategoryDomainInterface[]> {
        return await this.categoriesServiceDb.getCategoriesWithTheLargestNumberOfUsers(count);
    }
}

