import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/user/auth/auth.guard";
import { GetSubjectsDto } from "./dto/get-subjects.dto";
import { SubjectsService } from "./service/subjects.service";
import { User } from "src/user/auth/decorators/user.decorator";
import type { UserDomainInterface } from "src/db/user/interfaces/user.interfaces";

@UseGuards(AuthGuard)
@Controller("user/subjects")
export class UsersSubjectsController {
    constructor(private subjectsService: SubjectsService) {}

    @Get()
    async getUserSubjects(
        @User() user: UserDomainInterface,
        @Query() query: GetSubjectsDto,
    ) {
        return await this.subjectsService.getByCategoryIdWithCategoryAndUser({
            page: query.page,
            limit: query.limit,
            userId: user.id,
            categoryId: query.categoryId,
        });
    }
}
