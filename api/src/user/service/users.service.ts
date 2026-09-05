import { BadRequestException, ForbiddenException, Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { UpdateUserInterface, UserInterface } from "src/db/user/interfaces/user.interfaces";
import { UserServiceDb } from "src/db/user/user.service";
import { createHmac } from "crypto";
import { ConfigService } from "@nestjs/config";
import { MailerService } from "src/integrations/mailer/mailer.service";
import type { Cache } from "cache-manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { UserStatus } from "src/db/user/user.entity";
import { JwtService } from "@nestjs/jwt";
import { GetUsersResponseDto } from "../dto/get-users-response.dto";

@Injectable()
export class UserService {
    constructor(
        private usersServiceDb: UserServiceDb,
        private configService: ConfigService,
        private mailerService: MailerService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private jwtService: JwtService
    ) {}

    async deleteUserById(userId: number) {
        const userInDb = await this.usersServiceDb.findById(userId);

        if(!userInDb) {
            throw new NotFoundException({ message: "User not found" });
        }
        await this.usersServiceDb.deleteById(userId);
    }
    async updateIsOnlineStatusByUserId(id: number, status: UserStatus) {
        await this.usersServiceDb.updateById(id, { status: status });
    }
    async updateUserPassword(params: {
        userId: number;
        newPassword: string;
        oldPassword: string;
    }) {
        const userInDb: UserInterface | null = await this.usersServiceDb.findByIdWithSecureParams(params.userId);

        if(!userInDb) {
            throw new NotFoundException({ message: "User not found" });
        }
        const passwordHashAlg = this.configService.getOrThrow("PASSWORD_HASH_ALGORITHM");
        const passwordHashKey = this.configService.getOrThrow("PASSWORD_HASH_KEY");

        const oldPasswordHash = createHmac(passwordHashAlg, passwordHashKey).update(params.oldPassword).digest("hex");

        if(oldPasswordHash !== userInDb.password) {
            throw new ForbiddenException({ message: "Invalid old password" });
        }
        const newPasswordHash = createHmac(
            passwordHashAlg, 
            passwordHashKey
        ).update(params.newPassword).digest("hex");
        
        await this.usersServiceDb.updateById(
            params.userId,
            { 
                password: newPasswordHash
            }
        );
    }
    async updateUserParams(params: {
        userId: number;
        email?: string; 
        username?: string;
        timezone?: string;
        oldUsername: string;
        oldEmail: string;
        oldTimeZone: string;
    }): Promise<{ token: string; isMailSent: boolean; }> {
        const userInDb = await this.usersServiceDb.findById(params.userId);

        if(!userInDb) {
            throw new NotFoundException({ message: "User not found" });
        }
        let isMailSent: boolean = false;

        if(params.email && params.email !== params.oldEmail) {
            const userWithTheSameEmailInDb = await this.usersServiceDb.findByEmailAndNotId(params.email, params.userId);

            if(userWithTheSameEmailInDb) {
                throw new BadRequestException({ message: "User with the same email already exists" });
            }
            try {
                const mailFrom = this.configService.getOrThrow("CHANGE_EMAIL_MAIL_FROM");
                const mailSubject = this.configService.getOrThrow("CHANGE_EMAIL_MAIL_SUBJECT");
                const newEmailConfirmLink = this.configService.getOrThrow("CHANGE_EMAIL_MAIL_CONFIRM_LINK");

                const randomHash = createHmac("sha256", String(Date.now() + Math.floor(Math.random() * 1000))).digest("hex");

                await this.cacheManager.set(randomHash, JSON.stringify({ email: params.email, userId: params.userId }));

                await this.mailerService.sendMailWithHtml({
                    from: mailFrom,
                    to: params.email,
                    subject: mailSubject,
                    html: `<p>Confirm your new email by link. <a href="${newEmailConfirmLink + randomHash}">Click here</a>`
                });
                isMailSent = true;
            } catch(error) {
                console.log("Error", error);
                throw new InternalServerErrorException({ message: "Send mail error" });
            }
        }
        let updateData: UpdateUserInterface = {};

        if(params.username && params.username !== params.oldUsername) {
            updateData.username = params.username;
        }
        if(params.timezone && params.timezone !== params.oldTimeZone) {
            updateData.timezone = params.timezone;
        }
        if(Object.keys(updateData).length) {
            if(updateData.username) {
                const userWithTheSameUsernameInDb = await this.usersServiceDb.findByUsernameAndNotId(updateData.username, params.userId);

                if(userWithTheSameUsernameInDb) {
                    throw new BadRequestException({ message: "User with the same username already exists" });
                }
            }
            await this.usersServiceDb.updateById(params.userId, updateData);
        }
        const newToken = await this.jwtService.signAsync({
            id: params.userId,
            username: (params.username && params.username !== params.oldUsername) ? params.username : params.oldUsername,
            email: params.oldEmail,
            timezone: (params.timezone && params.timezone !== params.oldTimeZone) ? params.timezone : params.oldTimeZone
        }, {
            secret: this.configService.getOrThrow("USER_AUTH_JWT_SECRET"),
            expiresIn: this.configService.getOrThrow("USER_AUTH_JWT_EXPIRES_IN") 
        });

        return { token: newToken, isMailSent: isMailSent };
    }
    async confirmNewEmail(hash: string): Promise<string> {
        let parsedDataFromCache: { userId: number, email: string } | undefined = undefined;
        const dataInCache = await this.cacheManager.get(hash);

        if(!dataInCache) {
            throw new NotFoundException({ message: "Email not found" });
        }
        try {
            parsedDataFromCache = JSON.parse(dataInCache as string);
        } catch(error) {    
            throw new InternalServerErrorException({ message: "Parse data from cache error" });
        }
        if(!parsedDataFromCache) {
            throw new NotFoundException({ message: "Link expired" });
        }
        const userInDb = await this.usersServiceDb.findById(Number(parsedDataFromCache.userId));

        if(!userInDb) {
            throw new NotFoundException({ message: "User not found" });
        }
        await this.usersServiceDb.updateById(Number(parsedDataFromCache.userId), { email: parsedDataFromCache.email });

        const newToken = await this.jwtService.signAsync({
            id: userInDb.id, 
            email: parsedDataFromCache.email, 
            username: userInDb.username,
            timezone: userInDb.timezone
        }, {
            secret: this.configService.getOrThrow("USER_AUTH_JWT_SECRET"),
            expiresIn: this.configService.getOrThrow("USER_AUTH_JWT_EXPIRES_IN") 
        });

        return newToken;
    }
    async getUsers(params: {
        page: number;
        limit: number;
        searchUsername?: string; 
    }): Promise<GetUsersResponseDto> {
        const result = await this.usersServiceDb.findWithSearchByUsername({
            limit: params.limit,
            page: params.page,
            searchUsername: params.searchUsername
        });
        const count = await this.usersServiceDb.countAll();

        return {
            data: result,
            isLoadMorePossible: count > params.page * params.limit
        }
    }
}

