import {
    Body,
    Controller,
    Delete,
    HttpCode,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    Put,
    UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "src/user/auth/auth.guard";
import { CreateSlotsTemplateDto } from "./dto/create-slots-template.dto";
import { SlotsService } from "./service/slots.service";
import { CreateSingleSlotDto } from "./dto/create-single-slot.dto";
import { User } from "src/user/auth/decorators/user.decorator";
import type { UserDomainInterface } from "src/db/user/interfaces/user.interfaces";

@UseGuards(AuthGuard)
@Controller("/slots")
export class SlotsController {
    constructor(private slotsService: SlotsService) {}

    @HttpCode(HttpStatus.CREATED)
    @Put("templates")
    async createSlotsTemplate(
        @Body() body: CreateSlotsTemplateDto,
        @User() user: UserDomainInterface,
    ) {
        await this.slotsService.saveTemplate(body, user.id);

        return;
    }

    @HttpCode(HttpStatus.CREATED)
    @Post("single-slot")
    async createSingleSlot(
        @Body() body: CreateSingleSlotDto,
        @User() user: UserDomainInterface,
    ) {
        await this.slotsService.saveSingleSlot(body, user.id);

        return;
    }

    @HttpCode(HttpStatus.OK)
    @Delete("single-slot/:id")
    async deleteSingleSlotById(
        @Param("id", new ParseIntPipe()) id: number,
        @User() user: UserDomainInterface,
    ) {
        await this.slotsService.deleteSingleSlot(id, user.id);

        return;
    }
}
