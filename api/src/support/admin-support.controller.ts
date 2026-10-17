import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { AdminAuthGuard } from "src/admin/auth/admin-auth.guard";
import { AdminGetSupportMessagesDto } from "./dto/admin-get-support-messages.dto";
import { SupportService } from "./service/support.service";
import { GetSupportItemsResponseInterface } from "./dto/get-support-items-response.interface";

@UseGuards(AdminAuthGuard)
@Controller("/admin/support")
export class AdminSupportController {
    constructor(private supportService: SupportService) {}

    @Get()
    async getSupportMessages(
        @Query() query: AdminGetSupportMessagesDto,
    ): Promise<GetSupportItemsResponseInterface> {
        return await this.supportService.getSupportItems({
            page: query.page,
            limit: query.limit,
        });
    }
}
