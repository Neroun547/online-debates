import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Req, UseGuards } from "@nestjs/common";
import { UpdateUserOnlineStatusDto } from "./dto/update-user-online-status.dto";
import { AuthGuard } from "./auth/auth.guard";
import { UserService } from "./service/users.service";
import type { Request } from "express";
import { UpdateUserPassword } from "./dto/update-user-password.dto";
import { UpdateUserPersonalDataDto } from "./dto/update-personal-data.dto";
import { UpdateUserDataResponseDto } from "./dto/update-user-data-response.dto";

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
    async updateUserPersonalData(@Req() req: Request, @Body() body: UpdateUserPersonalDataDto): Promise<UpdateUserDataResponseDto> {
        const result = await this.usersService.updateUserParams({
            userId: req["user"].id,
            email: body.email?.trim(),
            username: body.username?.trim(),
            timezone: body.timezone?.trim(),
            oldEmail: req["user"].email,
            oldUsername: req["user"].username,
            oldTimeZone: req["user"].timezone
        });

        return { token: result.token, isMailSent: result.isMailSent };
    }

    @Get("confirm-new-email/:hash")
    async confirmUserNewEmailByHash(@Param("hash") hash: string): Promise<UpdateUserDataResponseDto> {
        const newToken = await this.usersService.confirmNewEmail(hash);

        return { token: newToken };
    }

    @UseGuards(AuthGuard)
    @Get()
    async getUserInfo(@Req() req: Request) {
        return {
            id: req["user"].id,
            username: req["user"].username,
            email: req["user"].email,
            timezone: req["user"].timezone
        }
    } 

    @UseGuards(AuthGuard)
    @Delete()
    async deleteUser(@Req() req: Request) {
        await this.usersService.deleteUserById(req["user"].id);

        return;
    }
}
