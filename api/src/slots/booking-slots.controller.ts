import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/user/auth/auth.guard";
import { GetSlotsForBookingRequestDto } from "./dto/get-slots-for-booking-request.dto";
import { BookSessionDto } from "./dto/book-session.dto";
import { SessionsService } from "../sessions/service/sessions.service";
import { SlotsService } from "./service/slots.service";

@UseGuards(AuthGuard)
@Controller("booking/slots")
export class BookingSlotsController {
    constructor(
        private slotsService: SlotsService,
        private sessionsService: SessionsService
    ) {

    }
    
    @Get()
    async getSlotsForBooking(@Query() query: GetSlotsForBookingRequestDto, @Req() req: Request) {
        return await this.slotsService.getSlotsForBooking({
            subjectId: query.subjectId,
            authorId: query.userId,
            dateFrom: query.dateFrom,
            dateTo: query.dateTo,
            customerId: req["user"].id
        });
    }

    @Post("session")
    async bookSession(@Body() body: BookSessionDto, @Req() req: Request) {
        await this.sessionsService.bookSession(body.slotId, req["user"].id, body.currentUserDateTime);

        return;
    }
}

