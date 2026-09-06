import { Body, Controller, Post } from "@nestjs/common";
import { CreateSupportMessageDto } from "./dto/create-support-message.dto";
import { SupportService } from "./service/support.service";

@Controller("/support")
export class SupportController {
    constructor(private supportService: SupportService) {}

    @Post()
    async createSupportMessage(@Body() body: CreateSupportMessageDto) {
        await this.supportService.save({
            email: body.email,
            subject: body.subject,
            message: body.message
        });

        return;
    }
}

