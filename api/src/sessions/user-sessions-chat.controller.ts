import { Controller, Get, Param, ParseIntPipe, Query, Req, UseGuards } from "@nestjs/common";
import { SessionsService } from "./service/sessions.service";
import { AuthGuard } from "src/user/auth/auth.guard";
import { GetMessagesRequestDto } from "./dto/get-messages-request.dto";

@UseGuards(AuthGuard)
@Controller("/user/sessions/:sessionId/chat")
export class UserSessionsChatController {
    constructor(private sessionsService: SessionsService) {

    }
    
    @Get("messages")
    async getMessages(@Req() req: Request, @Query() query: GetMessagesRequestDto, @Param("sessionId", new ParseIntPipe()) sessionId: number) {
        return await this.sessionsService.getMessages({
            skip: query.skip,
            limit: query.limit,
            sessionId: sessionId,
            userId: req["user"].id
        });
    }
}

