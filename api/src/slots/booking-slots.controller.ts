import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/user/auth/auth.guard";
import { GetSlotsForBookingRequestDto } from "./dto/get-slots-for-booking-request.dto";
import { BookSessionDto } from "./dto/book-session.dto";
import { SessionsService } from "../sessions/service/sessions.service";
import { SlotsService } from "./service/slots.service";
import { User } from "src/user/auth/decorators/user.decorator";
import type { UserDomainInterface } from "src/db/user/interfaces/user.interfaces";
import { GetSlotsAvailableDatesRequestDto } from "./dto/get-slots-available-dates-request.dto";

@UseGuards(AuthGuard)
@Controller("booking/slots")
export class BookingSlotsController {
    constructor(
        private slotsService: SlotsService,
        private sessionsService: SessionsService
    ) {

    }

    @Get("available-dates")
    async getAvailableDates(@Query() query: GetSlotsAvailableDatesRequestDto, @User() user: UserDomainInterface) {
        return await this.slotsService.getSlotsAvailableDatesByUserIdAndSubjectId(query.subjectId, query.userId, query.dateFrom, query.dateTo, user.id);
    }
    
    @Get()
    async getSlotsForBooking(@Query() query: GetSlotsForBookingRequestDto, @User() user: UserDomainInterface) {
        return await this.slotsService.getSlotsForBooking({
            subjectId: query.subjectId,
            authorId: query.userId,
            dateFrom: query.dateFrom,
            dateTo: query.dateTo,
            customerId: user.id
        });
    }

    @Post("session")
    async bookSession(@Body() body: BookSessionDto, @User() user: UserDomainInterface) {
        await this.sessionsService.bookSession(body.slotId, user.id, body.currentUserDateTime);

        return;
    }
}
