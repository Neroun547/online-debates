import { BadRequestException, ForbiddenException, Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { UpdateUserInterface, UserDomainInterface, UserInterface } from "src/db/user/interfaces/user.interfaces";
import { UserServiceDb } from "src/db/user/user.service";
import { createHmac } from "crypto";
import { ConfigService } from "@nestjs/config";
import { MailerService } from "src/integrations/mailer/mailer.service";
import type { Cache } from "cache-manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { UserStatus } from "src/db/user/user.entity";
import { GetUsersResponseDto } from "../dto/get-users-response.dto";
import { CreateUserRequestDto } from "../dto/create-user-request.dto";
import { AuthService } from "../auth/service/auth.service";
import { unlink } from "fs/promises";

@Injectable()
export class UserService {
    constructor(
        private usersServiceDb: UserServiceDb,
        private configService: ConfigService,
        private mailerService: MailerService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private authService: AuthService
    ) {}

    async updateUserLanguage(userId: number, language: string) {
        await this.usersServiceDb.updateById(userId, { language: language });
    }
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
        isAvailableForPermanentSessions?: boolean;
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
                    html: this.mailerService.addBaseTemplateToLetter(`<p>Confirm your new email by link. <a href="${newEmailConfirmLink + randomHash}">Click here</a>`)
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
        if(typeof params.isAvailableForPermanentSessions === "boolean") {
            updateData.isAvailableForPermanentSessions = params.isAvailableForPermanentSessions;
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
        const newToken = await this.authService.generateJwtToken({
            id: params.userId,
            username: (params.username && params.username !== params.oldUsername) ? params.username : params.oldUsername,
            email: params.oldEmail,
            timezone: (params.timezone && params.timezone !== params.oldTimeZone) ? params.timezone : params.oldTimeZone,
            isAvailableForPermanentSessions: typeof params.isAvailableForPermanentSessions === "boolean" ? params.isAvailableForPermanentSessions : userInDb.isAvailableForPermanentSessions,
            language: userInDb.language,
            status: userInDb.status,
            avatarFilename: userInDb.avatarFilename
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

        const newToken = await this.authService.generateJwtToken({
            id: userInDb.id,
            email: parsedDataFromCache.email,
            username: userInDb.username,
            timezone: userInDb.timezone,
            isAvailableForPermanentSessions: userInDb.isAvailableForPermanentSessions,
            language: userInDb.language,
            status: userInDb.status,
            avatarFilename: userInDb.avatarFilename
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
            isLoadMorePossible: count > params.page * params.limit,
            count: count
        }
    }

    async createUser(params: CreateUserRequestDto) {
        const userInDb = await this.usersServiceDb.findByEmailOrUsernameTwoSeparateParams(params.email, params.username);

        if(userInDb) {
            throw new BadRequestException({ message: "User with the same username or email already exists" });
        }
        const passwordHash = createHmac(this.configService.getOrThrow("PASSWORD_HASH_ALGORITHM"), this.configService.getOrThrow("PASSWORD_HASH_KEY")).update(params.password).digest("hex");
        
        await this.usersServiceDb.save({
            username: params.username,
            email: params.email,
            password: passwordHash,
            isConfirmed: true,
            status: UserStatus.OFFLINE,
            timezone: params.timezone,
            language: null,
            isAvailableForPermanentSessions: true,
            avatarFilename: null
        });
    }

    async sendPasswordRecoveryLink(email: string) {
        const userInDb = await this.usersServiceDb.findByEmail(email);

        if(!userInDb) {
            throw new NotFoundException({ message: "User not found" });
        }
        const randomHash = createHmac("sha256", String(Date.now() + Math.floor(Math.random() * 1000))).digest("hex");
        const passwordRecoveryLetterTTL = this.configService.getOrThrow("PASSWORD_RECOVERY_LETTER_TTL");

        await this.cacheManager.set(randomHash, userInDb.id, Number(passwordRecoveryLetterTTL));
  
        const passwordRecoveryMailFrom = this.configService.getOrThrow("PASSWORD_RECOVERY_MAIL_FROM");
        const passwordRecoveryMailSubject = this.configService.getOrThrow("PASSWORD_RECOVERY_MAIL_SUBJECT");
        const passwordRecoveryMailLink = this.configService.getOrThrow("PASSWORD_RECOVERY_MAIL_LINK");

        await this.mailerService.sendMailWithHtml({
            from: passwordRecoveryMailFrom,
            to: email,
            subject: passwordRecoveryMailSubject,
            html: this.mailerService.addBaseTemplateToLetter(`<a href="${passwordRecoveryMailLink + randomHash}">Click to recover password</a>`)
        });
    }

    async passwordRecovery(newPassword: string, hash: string) {
        const dataInCache = await this.cacheManager.get(hash);

        if(!dataInCache) {
            throw new NotFoundException();
        }
        const newPasswordHash = createHmac(this.configService.getOrThrow("PASSWORD_HASH_ALGORITHM"), this.configService.getOrThrow("PASSWORD_HASH_KEY")).update(newPassword).digest("hex");
        
        await this.usersServiceDb.updateById(Number(dataInCache), { password: newPasswordHash });
        this.cacheManager.del(hash)
        .catch((error) => {
            console.log("passwordRecovery: delete data from Redis error", error);
        });
    }

    async adminUpdateUser(params: {
        userId: number;
        email: string;
        username: string;
        timezone: string;
        password?: string;
    }) {
        const userWithTheSameEmailInDb = await this.usersServiceDb.findByEmailAndNotId(params.email, params.userId);
        const userWithTheSameUsernameInDb = await this.usersServiceDb.findByUsernameAndNotId(params.username, params.userId);

        if(userWithTheSameEmailInDb) {
            throw new BadRequestException({ message: "User with the same email already exists in db" });
        }
        if(userWithTheSameUsernameInDb) {
            throw new BadRequestException({ message: "User with the same username already exists in db" });
        } 

        await this.usersServiceDb.updateById(
            params.userId, 
            {
                password: (typeof params.password === "string" && params.password.length >= 8) ? createHmac(this.configService.getOrThrow("PASSWORD_HASH_ALGORITHM"), this.configService.getOrThrow("PASSWORD_HASH_KEY")).update(params.password).digest("hex") : undefined,
                email: params.email,
                timezone: params.timezone,
                username: params.username,
            }
        )
    }

    async updateUserAvatar(user: UserDomainInterface, filename: string | null): Promise<{ token: string; avatarFilename: string | null }> {
        const oldFilename = await this.usersServiceDb.updateUserAvatar(user.id, filename);

        if(oldFilename) {   
            unlink(this.configService.getOrThrow("BASE_USER_AVATAR_PATH") + "/" + oldFilename)
                .catch(error => {
                    console.log("Delete old file error", error);
                });
        }
        return { 
            token: await this.authService.generateJwtToken({
                id: user.id,
                username: user.username,
                email: user.email,
                status: user.status,
                timezone: user.timezone,
                language: user.language,
                avatarFilename: filename,
                isAvailableForPermanentSessions: user.isAvailableForPermanentSessions
            }),
            avatarFilename: filename
        };
    }
}

