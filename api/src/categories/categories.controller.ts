import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/user/auth/auth.guard";
import { CategoriesService } from "./service/categories.service";
import { GetCategoriesDto } from "./dto/get-categories.dto";
import { GetCategoriesResponseDto } from "./dto/get-categories-response.dto";

@Controller("categories")
export class CategoriesController {
    constructor(private categoriesService: CategoriesService) {

    }

    @UseGuards(AuthGuard)
    @Get()
    async getCategories(@Query() query: GetCategoriesDto): Promise<GetCategoriesResponseDto> {
        return await this.categoriesService.getWithPagination(query.page, query.limit);
    }

    @UseGuards(AuthGuard)
    @Get(":id")
    async getCategoryById(@Param("id", new ParseIntPipe()) id: number) {
        return await this.categoriesService.getCategoryById(id);
    }
}

