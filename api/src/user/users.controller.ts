import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { UpdateUserOnlineStatusDto } from "./dto/update-user-online-status.dto";
import { AuthGuard } from "./auth/auth.guard";
import { UserService } from "./service/users.service";
import { UpdateUserPassword } from "./dto/update-user-password.dto";
import { UpdateUserPersonalDataDto } from "./dto/update-personal-data.dto";
import { UpdateUserDataResponseDto } from "./dto/update-user-data-response.dto";
import { User } from "./auth/decorators/user.decorator";
import type { UserDomainInterface } from "src/db/user/interfaces/user.interfaces";
import { SendPasswordRecoveryLink } from "./dto/send-password-recovery-link.dto";
import { PasswordRecoveryDto } from "./dto/password-recovery.dto";
import { UpdateUserLanguageDto } from "./dto/update-user-language.dto";

@Controller("users")
export class UsersController {
    constructor(private usersService: UserService) {}

    @UseGuards(AuthGuard)
    @Patch("status")
    async updateUserOnlineStatus(@Body() body: UpdateUserOnlineStatusDto, @User() user: UserDomainInterface) {
        await this.usersService.updateIsOnlineStatusByUserId(user.id, body.status);

        return;
    }

    @Post("send-password-recovery-link")
    async sendPasswordRecoveryLink(@Body() body: SendPasswordRecoveryLink) {
        await this.usersService.sendPasswordRecoveryLink(body.email);

        return;
    }
    
    @UseGuards(AuthGuard)
    @Patch("language")
    async updateUserLanguage(@User() user: UserDomainInterface, @Body() body: UpdateUserLanguageDto) {
        await this.usersService.updateUserLanguage(user.id, body.language);

        return;
    }

    @Patch("password-recovery/:hash")
    async passwordRecovery(@Body() body: PasswordRecoveryDto, @Param("hash") hash: string) {
        await this.usersService.passwordRecovery(body.password, hash);

        return;
    }

    @UseGuards(AuthGuard)
    @Patch("password")
    async updatePassword(@Body() body: UpdateUserPassword, @User() user: UserDomainInterface) {
        if(body.newPassword.trim() !== body.confirmNewPassword.trim()) {
            throw new BadRequestException({ message: "New password and confirm password not the same" });
        }
        await this.usersService.updateUserPassword({
            userId: user.id,
            newPassword: body.newPassword.trim(),
            oldPassword: body.oldPassword
        });

        return;
    }

    @UseGuards(AuthGuard)
    @Patch("personal-data")
    async updateUserPersonalData(@User() user: UserDomainInterface, @Body() body: UpdateUserPersonalDataDto): Promise<UpdateUserDataResponseDto> {
        const result = await this.usersService.updateUserParams({
            userId: user.id,
            email: body.email?.trim(),
            username: body.username?.trim(),
            timezone: body.timezone?.trim(),
            oldEmail: user.email,
            oldUsername: user.username,
            oldTimeZone: user.timezone,
            isAvailableForPermanentSessions: body.isAvailableForPermanentSessions
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
    async getUserInfo(@User() user: UserDomainInterface) {
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            timezone: user.timezone,
            isAvailableForPermanentSessions: user.isAvailableForPermanentSessions
        }
    } 

    @UseGuards(AuthGuard)
    @Delete()
    async deleteUser(@User() user: UserDomainInterface) {
        await this.usersService.deleteUserById(user.id);

        return;
    }
}
