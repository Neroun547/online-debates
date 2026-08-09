import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/user/auth/auth.guard";
import { GetUserTemplatesDto } from "./dto/get-user-templates.dto";
import { SlotsService } from "./service/slots.service";
import type { Request } from "express";

@UseGuards(AuthGuard)
@Controller("users/slots")
export class UsersSlotsController {
    constructor(private slotsService: SlotsService) {}

    @Get("templates")
    async getUserTemplates(@Query() query: GetUserTemplatesDto, @Req() req: Request) {
        return await this.slotsService.getTemplatesByUserIdAndSubjectId(req["user"].id, query.subjectId);
    }
}

