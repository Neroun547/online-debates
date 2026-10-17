import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/user/auth/auth.guard";
import { GetUserTemplatesDto } from "./dto/get-user-templates.dto";
import { SlotsService } from "./service/slots.service";
import { GetUserSingleSlotsDto } from "./dto/get-user-single-slots-request.dto";
import { GetUserSingleSlotsCountDto } from "./dto/get-user-single-slots-count-request.dto";
import { User } from "src/user/auth/decorators/user.decorator";
import type { UserDomainInterface } from "src/db/user/interfaces/user.interfaces";

@UseGuards(AuthGuard)
@Controller("user/slots")
export class UsersSlotsController {
    constructor(private slotsService: SlotsService) {}

    @Get("templates")
    async getUserTemplates(
        @Query() query: GetUserTemplatesDto,
        @User() user: UserDomainInterface,
    ) {
        return await this.slotsService.getTemplatesByUserIdAndSubjectId(
            user.id,
            query.subjectId,
        );
    }

    @Get("single-slots")
    async getSingleSlots(
        @Query() query: GetUserSingleSlotsDto,
        @User() user: UserDomainInterface,
    ) {
        return await this.slotsService.getSingleSlots({
            ...query,
            userId: user.id,
            subjectId: query.subjectId,
        });
    }

    @Get("single-slots/count")
    async getTotalSingleSlots(
        @Query() query: GetUserSingleSlotsCountDto,
        @User() user: UserDomainInterface,
    ) {
        const count = await this.slotsService.getTotalSingleSlots(
            user.id,
            query.dateFrom,
            query.dateTo,
            query.subjectId,
        );

        return { count: count };
    }
}
