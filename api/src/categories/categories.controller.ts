import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/user/auth/auth.guard";
import { CategoriesService } from "./service/categories.service";
import { GetCategoriesDto } from "./dto/get-categories.dto";

@Controller("categories")
export class CategoriesController {
    constructor(private categoriesService: CategoriesService) {

    }

    @UseGuards(AuthGuard)
    @Get()
    async getCategories(@Query() query: GetCategoriesDto) {
        return await this.categoriesService.getWithPagination(query.page, query.limit);
    }
}

