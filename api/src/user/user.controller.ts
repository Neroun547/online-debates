import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    NotFoundException,
    Param,
    Patch,
    Post,
    Put,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "./auth/auth.guard";
import type { UserDomainInterface } from "src/db/user/interfaces/user.interfaces";
import { User } from "./auth/decorators/user.decorator";
import { UserService } from "./service/users.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { PasswordRecoveryDto } from "./dto/password-recovery.dto";
import { SendPasswordRecoveryLink } from "./dto/send-password-recovery-link.dto";
import { UpdateUserPersonalDataDto } from "./dto/update-personal-data.dto";
import { UpdateUserAboutInfoDto } from "./dto/update-user-about-info.dto";
import { UpdateUserDataResponseDto } from "./dto/update-user-data-response.dto";
import { UpdateUserLanguageDto } from "./dto/update-user-language.dto";
import { UpdateUserOnlineStatusDto } from "./dto/update-user-online-status.dto";
import { UpdateUserPassword } from "./dto/update-user-password.dto";
import type { BaseUploadAvatarFileInterface } from "./interfaces/base-upload-avatar-file.interface";
import { AvatarFileValidationPipe } from "./pipes/avatar-file-validation.pipe";

@Controller("/user")
export class UserController {
    constructor(private usersService: UserService) {}

    @UseGuards(AuthGuard)
    @Put("about")
    async updateUserAboutInfo(
        @Body() body: UpdateUserAboutInfoDto,
        @User() user: UserDomainInterface,
    ) {
        await this.usersService.updateUserAboutInfo(user.id, body);

        return;
    }

    @UseGuards(AuthGuard)
    @Patch("status")
    async updateUserOnlineStatus(
        @Body() body: UpdateUserOnlineStatusDto,
        @User() user: UserDomainInterface,
    ) {
        await this.usersService.updateIsOnlineStatusByUserId(
            user.id,
            body.status,
        );

        return;
    }

    @Post("send-password-recovery-link")
    async sendPasswordRecoveryLink(@Body() body: SendPasswordRecoveryLink) {
        await this.usersService.sendPasswordRecoveryLink(body.email);

        return;
    }

    @UseGuards(AuthGuard)
    @Patch("language")
    async updateUserLanguage(
        @User() user: UserDomainInterface,
        @Body() body: UpdateUserLanguageDto,
    ) {
        await this.usersService.updateUserLanguage(user.id, body.language);

        return;
    }

    @UseGuards(AuthGuard)
    @Delete("avatar")
    async deleteUserAvatar(@User() user: UserDomainInterface) {
        await this.usersService.updateUserAvatar(user, null);

        return;
    }

    @UseGuards(AuthGuard)
    @UseInterceptors(
        FileInterceptor("file", { dest: process.env.BASE_USER_AVATAR_PATH }),
    )
    @Patch("avatar")
    async updateUserAvatar(
        @UploadedFile(new AvatarFileValidationPipe())
        file: BaseUploadAvatarFileInterface,
        @User() user: UserDomainInterface,
    ) {
        return await this.usersService.updateUserAvatar(user, file.filename);
    }

    @Patch("password-recovery/:hash")
    async passwordRecovery(
        @Body() body: PasswordRecoveryDto,
        @Param("hash") hash: string,
    ) {
        await this.usersService.passwordRecovery(body.password, hash);

        return;
    }

    @UseGuards(AuthGuard)
    @Patch("password")
    async updatePassword(
        @Body() body: UpdateUserPassword,
        @User() user: UserDomainInterface,
    ) {
        if (body.newPassword.trim() !== body.confirmNewPassword.trim()) {
            throw new BadRequestException({
                message: "New password and confirm password not the same",
            });
        }
        await this.usersService.updateUserPassword({
            userId: user.id,
            newPassword: body.newPassword.trim(),
            oldPassword: body.oldPassword,
        });

        return;
    }

    @UseGuards(AuthGuard)
    @Patch("personal-data")
    async updateUserPersonalData(
        @User() user: UserDomainInterface,
        @Body() body: UpdateUserPersonalDataDto,
    ): Promise<UpdateUserDataResponseDto> {
        const result = await this.usersService.updateUserParams({
            userId: user.id,
            email: body.email?.trim(),
            username: body.username?.trim(),
            timezone: body.timezone?.trim(),
            oldEmail: user.email,
            oldUsername: user.username,
            oldTimeZone: user.timezone,
            isAvailableForPermanentSessions:
                body.isAvailableForPermanentSessions,
        });

        return { token: result.token, isMailSent: result.isMailSent };
    }

    @Get("confirm-new-email/:hash")
    async confirmUserNewEmailByHash(
        @Param("hash") hash: string,
    ): Promise<UpdateUserDataResponseDto> {
        const newToken = await this.usersService.confirmNewEmail(hash);

        return { token: newToken };
    }

    @UseGuards(AuthGuard)
    @Delete()
    async deleteUser(@User() user: UserDomainInterface) {
        await this.usersService.deleteUserById(user.id);

        return;
    }

    @UseGuards(AuthGuard)
    @Get()
    async getUserInfo(@User() userFromToken: UserDomainInterface) {
        const user = await this.usersService.findById(userFromToken.id);

        if (!user) {
            throw new NotFoundException({ message: "User not found" });
        }
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            timezone: user.timezone,
            isAvailableForPermanentSessions:
                user.isAvailableForPermanentSessions,
            age: user.age,
            description: user.description,
            sex: user.sex,
        };
    }
}
