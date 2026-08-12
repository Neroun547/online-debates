import { Body, Controller, Post } from "@nestjs/common";
import { AuthDto } from "./dto/auth.dto";
import { AuthService } from "./service/auth.service";
import { AuthResponseDto } from "./dto/auth-response.dto";

@Controller("/users/auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post()
    async auth(@Body() body: AuthDto): Promise<AuthResponseDto> {
        const result = await this.authService.auth(body);

        return { token: result.token, userId: result.userId };
    }
}

