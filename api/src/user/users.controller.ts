import { BadRequestException, Body, Controller, Get, Param, Patch, Req, UseGuards } from "@nestjs/common";
import { UpdateUserOnlineStatusDto } from "./dto/update-user-online-status.dto";
import { AuthGuard } from "./auth/auth.guard";
import { UserService } from "./service/users.service";
import type { Request } from "express";
import { UpdateUserPassword } from "./dto/update-user-password.dto";
import { UpdateUserPersonalDataDto } from "./dto/update-personal-data.dto";

@Controller("users")
export class UsersController {
    constructor(private usersService: UserService) {}

    @UseGuards(AuthGuard)
    @Patch("status")
    async updateUserOnlineStatus(@Body() body: UpdateUserOnlineStatusDto, @Req() req: Request) {
        const user = req["user"];

        await this.usersService.updateIsOnlineStatusByUserId(user.id, body.status);

        return;
    }

    @UseGuards(AuthGuard)
    @Patch("password")
    async updatePassword(@Body() body: UpdateUserPassword, @Req() req: Request) {
        if(body.newPassword.trim() !== body.confirmNewPassword.trim()) {
            throw new BadRequestException({ message: "New password and confirm password not the same" });
        }
        await this.usersService.updateUserPassword({
            userId: req["user"].id,
            newPassword: body.newPassword.trim(),
            oldPassword: body.oldPassword
        });

        return;
    }

    @UseGuards(AuthGuard)
    @Patch("personal-data")
    async updateUserPersonalData(@Req() req: Request, @Body() body: UpdateUserPersonalDataDto) {
        await this.usersService.updateUserParams({
            userId: req["user"].id,
            email: body.email,
            username: body.username
        });

        return;
    }

    @Get("confirm-new-email/:hash")
    async confirmUserNewEmailByHash(@Param("hash") hash: string) {
        await this.usersService.confirmNewEmail(hash);

        return;
    }
}
