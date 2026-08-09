import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/user/auth/auth.guard";
import { GetSubjectsDto } from "./dto/get-subjects.dto";
import { SubjectsService } from "./service/subjects.service";
import type { Request } from "express";

@UseGuards(AuthGuard)
@Controller("users/subjects")
export class UsersSubjectsController {
    constructor(private subjectsService: SubjectsService) {

    }

    @Get()
    async getUserSubjects(@Req() req: Request, @Query() query: GetSubjectsDto) {
        return await this.subjectsService.getByCategoryIdWithCategoryAndUser({
            page: query.page,
            limit: query.limit,
            userId: req["user"].id,
            categoryId: query.categoryId
        })
    }
}
