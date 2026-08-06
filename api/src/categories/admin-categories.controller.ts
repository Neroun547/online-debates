import { Body, Controller, Delete, Param, ParseIntPipe, Post, Put, UseGuards } from "@nestjs/common";
import { CategoriesService } from "./service/categories.service";
import { AdminAuthGuard } from "src/admin/auth/admin-auth.guard";
import { SaveCategoryDto } from "./dto/save-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@UseGuards(AdminAuthGuard)
@Controller("admin/categories")
export class AdminCategoriesController {
    constructor(private categoriesService: CategoriesService) {}

    @Post()
    async saveCategory(@Body() body: SaveCategoryDto) {
        await this.categoriesService.saveCategory(body);

        return;
    }

    @Delete(":id")
    async deleteCategory(@Param("id", new ParseIntPipe()) id: number) {
        await this.categoriesService.deleteCategoryById(id);

        return;
    }

    @Put(":id")
    async updateCategory(@Param("id", new ParseIntPipe()) id: number, @Body() body: UpdateCategoryDto) {
        await this.categoriesService.updateById(id, body);

        return;
    }    
}

