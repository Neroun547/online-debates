import { Controller, Get, Query, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/user/auth/auth.guard";
import { GetSlotsForBookingRequestDto } from "./dto/get-slots-for-booking-request.dto";
import { SlotsService } from "./service/slots.service";
import { SlotDomainInterface } from "src/db/slots/interfaces/slots.interfaces";

@UseGuards(AuthGuard)
@Controller("booking/slots")
export class BookingSlotsController {
    constructor(private slotsService: SlotsService) {

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
}

