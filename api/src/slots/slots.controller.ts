import { Body, Controller, Get, HttpCode, HttpStatus, Post, Put, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/user/auth/auth.guard";
import { CreateSlotsTemplateDto } from "./dto/create-slots-template.dto";
import { SlotsService } from "./service/slots.service";

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
}
