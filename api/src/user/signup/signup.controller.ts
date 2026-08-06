import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { SignupDto } from "./dto/signup.dto";
import { SignupService } from "./service/signup.service";

@Controller("/users/signup/")
export class SignupController {
    constructor(private signupService: SignupService) {}

    @Post()
    async signup(@Body() body: SignupDto) {
        await this.signupService.signup(body);

        return;
    }

    @Get("confirm/:hash")
    async confirmUserAccountByHash(@Param("hash") hash: string) {
        await this.signupService.confirmUserAccountByMailHash(hash);

        return;
    }   
}

