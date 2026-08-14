import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/user/auth/auth.guard";
import { GetAllUserSessionsRequestDto } from "./dto/get-all-user-sessions-request.dto";
import type { Request } from "express";
import { SessionsService } from "./service/sessions.service";

@UseGuards(AuthGuard)
@Controller("/user/sessions")
export class UserSessionsController {
    constructor(private sessionsService: SessionsService) {

    }
    
    @Get()
    async getAllUserSessions(@Query() query: GetAllUserSessionsRequestDto, @Req() req: Request) {
        return await this.sessionsService.getAllUsersSessions({
            dateFrom: query.dateFrom,
            dateTo: query.dateTo,
            page: query.page,
            limit: query.limit,
            status: query.status,
            userId: req["user"].id
        });
    }
}

