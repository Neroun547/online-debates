import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Put, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/user/auth/auth.guard";
import { CreateSlotsTemplateDto } from "./dto/create-slots-template.dto";
import { SlotsService } from "./service/slots.service";
import { CreateSingleSlotDto } from "./dto/create-single-slot.dto";

@UseGuards(AuthGuard)
@Controller("/slots")
export class SlotsController {
    constructor(private slotsService: SlotsService) {

    }

    @HttpCode(HttpStatus.CREATED)
    @Put("templates")
    async createSlotsTemplate(@Body() body: CreateSlotsTemplateDto, @Req() req: Request) {
        await this.slotsService.saveTemplate(body, req["user"].id);

        return;
    }

    @HttpCode(HttpStatus.CREATED)
    @Post("single-slot")
    async createSingleSlot(@Body() body: CreateSingleSlotDto, @Req() req: Request) {
        await this.slotsService.saveSingleSlot(body, req["user"].id);

        return;
    }

    @HttpCode(HttpStatus.OK)
    @Delete("single-slot/:id")
    async deleteSingleSlotById(@Param("id", new ParseIntPipe()) id: number, @Req() req: Request) {
        await this.slotsService.deleteSingleSlot(id, req["user"].id);

        return;
    }
}
