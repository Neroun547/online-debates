import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { AuthDto } from "./dto/auth.dto";
import { AuthService } from "./service/auth.service";
import { AuthResponseDto } from "./dto/auth-response.dto";
import { AuthGuard } from "./auth.guard";
import { User } from "./decorators/user.decorator";
import type { UserDomainInterface } from "src/db/user/interfaces/user.interfaces";

@Controller("/users/auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post()
    async auth(@Body() body: AuthDto): Promise<AuthResponseDto> {
        const result = await this.authService.auth(body);

        return {
            token: result.token,
            userId: result.userId,
            isOnline: result.isOnline,
            language: result.language,
            avatarFilename: result.avatarFilename,
        };
    }

    @UseGuards(AuthGuard)
    @Post("refresh-token")
    async refreshAuthToken(
        @User() user: UserDomainInterface,
    ): Promise<AuthResponseDto> {
        return await this.authService.refreshAuthToken(user.id);
    }
}
