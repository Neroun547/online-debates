import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/user/auth/auth.guard";
import { GetAllUserSessionsRequestDto } from "./dto/get-all-user-sessions-request.dto";
import { SessionsService } from "./service/sessions.service";
import { WebRTCService } from "src/integrations/webRTC/webRTC.service";
import { User } from "src/user/auth/decorators/user.decorator";
import type { UserDomainInterface } from "src/db/user/interfaces/user.interfaces";

@UseGuards(AuthGuard)
@Controller("/user/sessions")
export class UserSessionsController {
    constructor(
        private sessionsService: SessionsService,
        private webRTCService: WebRTCService
    ) {
        
    }
    
    @Get()
    async getAllUserSessions(@Query() query: GetAllUserSessionsRequestDto, @User() user: UserDomainInterface) {
        return await this.sessionsService.getAllUsersSessions({
            dateFrom: query.dateFrom,
            dateTo: query.dateTo,
            page: query.page,
            limit: query.limit,
            status: query.status,
            userId: user.id
        });
    }
}

