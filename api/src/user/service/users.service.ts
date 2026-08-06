import { ForbiddenException, Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { UserInterface } from "src/db/user/interfaces/user.interfaces";
import { UserServiceDb } from "src/db/user/user.service";
import { createHmac } from "crypto";
import { ConfigService } from "@nestjs/config";
import { MailerService } from "src/integrations/mailer/mailer.service";
import type { Cache } from "cache-manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { UserStatus } from "src/db/user/user.entity";

@Injectable()
export class UserService {
    constructor(
        private usersServiceDb: UserServiceDb,
        private configService: ConfigService,
        private mailerService: MailerService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}

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
    }) {
        const userInDb = await this.usersServiceDb.findById(params.userId);

        if(!userInDb) {
            throw new NotFoundException({ message: "User not found" });
        }
        if(params.email) {
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
            } catch(error) {
                console.log("Error", error);
                throw new InternalServerErrorException({ message: "Send mail error" });
            }
        }
        if(params.username) {
            await this.usersServiceDb.updateById(params.userId, { username: params.username });
        }
    }
    async confirmNewEmail(hash: string) {
        let parsedDataFromCache: { userId: number, email: string } | undefined = undefined;

        try {
            const dataInCache = await this.cacheManager.get(hash);
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
    }
}

