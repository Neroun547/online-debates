import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/user/auth/auth.guard";
import { SessionsService } from "./service/sessions.service";
import { BookSessionNowDto } from "./dto/book-session-now.dto";
import { BookSessionNowResponseDto } from "./dto/book-session-now-response.dto";

@UseGuards(AuthGuard)
@Controller("sessions")
export class SessionsController {
    constructor(private sessionsService: SessionsService) {}

    @Post("book-now")
    async bookSessionNow(@Body() body: BookSessionNowDto, @Req() req: Request): Promise<BookSessionNowResponseDto> {
        const sessionId = await this.sessionsService.bookSessionNow({
            creatorId: body.userId,
            customerId: req["user"].id,
            categoryId: body.categoryId,
            subjectId: body.subjectId
        });

        return {
            sessionId: sessionId
        };
    }
}
