import { Body, Controller, Post } from "@nestjs/common";
import { AdminAuthService } from "./service/admin-auth.service";
import { AuthDto } from "./dto/auth.dto";

@Controller("/admin/auth")
export class AdminAuthController {
    constructor(private adminAuthService: AdminAuthService) {

    }

    @Post()
    async auth(@Body() body: AuthDto) {
        const token = await this.adminAuthService.auth(body);

        return { token: token };
    }
}

