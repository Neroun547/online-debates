import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/user/auth/auth.guard";
import { GetUserTemplatesDto } from "./dto/get-user-templates.dto";
import { SlotsService } from "./service/slots.service";
import type { Request } from "express";
import { GetUserSingleSlotsDto } from "./dto/get-user-single-slots-request.dto";
import { GetUserSingleSlotsCountDto } from "./dto/get-user-single-slots-count-request.dto";

@UseGuards(AuthGuard)
@Controller("user/slots")
export class UsersSlotsController {
    constructor(private slotsService: SlotsService) {}

    @Get("templates")
    async getUserTemplates(@Query() query: GetUserTemplatesDto, @Req() req: Request) {
        return await this.slotsService.getTemplatesByUserIdAndSubjectId(req["user"].id, query.subjectId);
    }

    @Get("single-slots")
    async getSingleSlots(@Query() query: GetUserSingleSlotsDto, @Req() req: Request) {
        return await this.slotsService.getSingleSlots({
            ...query,
            userId: req["user"].id,
            subjectId: query.subjectId
        });
    }

    @Get("single-slots/count")
    async getTotalSingleSlots(@Query() query: GetUserSingleSlotsCountDto, @Req() req: Request) {
        const count = await this.slotsService.getTotalSingleSlots(req["user"].id, query.dateFrom, query.dateTo, query.subjectId);

        return { count: count }
    }
}

