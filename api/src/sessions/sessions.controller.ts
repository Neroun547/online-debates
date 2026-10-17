import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/user/auth/auth.guard";
import { SessionsService } from "./service/sessions.service";
import { BookSessionNowDto } from "./dto/book-session-now.dto";
import { BookSessionNowResponseDto } from "./dto/book-session-now-response.dto";
import { User } from "src/user/auth/decorators/user.decorator";
import type { UserDomainInterface } from "src/db/user/interfaces/user.interfaces";

@UseGuards(AuthGuard)
@Controller("sessions")
export class SessionsController {
    constructor(private sessionsService: SessionsService) {}

    @Post("book-now")
    async bookSessionNow(
        @Body() body: BookSessionNowDto,
        @User() user: UserDomainInterface,
    ): Promise<BookSessionNowResponseDto> {
        const sessionId = await this.sessionsService.bookSessionNow({
            creatorId: body.userId,
            customerId: user.id,
            categoryId: body.categoryId,
            subjectId: body.subjectId,
        });

        return {
            sessionId: sessionId,
        };
    }
}
