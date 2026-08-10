import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { SignupDto } from "../dto/signup.dto";
import { UserServiceDb } from "src/db/user/user.service";
import * as crypto from "crypto";
import { CACHE_MANAGER, Cache } from "@nestjs/cache-manager";
import { ConfigService } from "@nestjs/config";
import { MailerService } from "src/integrations/mailer/mailer.service";
import { UserDomainInterface } from "src/db/user/interfaces/user.interfaces";
import { UserStatus } from "src/db/user/user.entity";

@Injectable()
export class SignupService {
    constructor(
        private userServiceDb: UserServiceDb,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        private configService: ConfigService,
        private mailerService: MailerService
    ) {}

    async signup(body: SignupDto): Promise<void> {
        const userInDb = await this.userServiceDb.findByEmailOrUsernameTwoSeparateParams(body.email, body.username);

        if(userInDb) {
            throw new BadRequestException({ message: "User with the same username or email already exists" });
        }        
        try {
            const randomHash = crypto.createHmac("sha256", String(Date.now() + Math.random() * 1000)).digest("hex");
            const mailFrom = this.configService.getOrThrow("SIGNUP_CONFIRM_MAIL_FROM");
            const mailSubject = this.configService.getOrThrow("SIGNUP_CONFIRM_MAIL_SUBJECT");
            const baseUrl = this.configService.getOrThrow("SIGNUP_CONFIRM_MAIL_LINK");
            const passwordHash = crypto.createHmac(this.configService.getOrThrow("PASSWORD_HASH_ALGORITHM"), this.configService.getOrThrow("PASSWORD_HASH_KEY")).update(body.password).digest("hex");
            
            const createdUser: UserDomainInterface = await this.userServiceDb.saveAndReturn({
                username: body.username,
                email: body.email,
                password: passwordHash,
                isConfirmed: false,
                status: UserStatus.OFFLINE,
                timezone: body.timezone
            });

            await this.cacheManager.set(randomHash, createdUser.id, Number(this.configService.getOrThrow("SIGNUP_CONFIRM_ACCOUNT_LETTER_TTL")));

            await this.mailerService.sendMailWithHtml({
                from: mailFrom,
                subject: mailSubject,
                to: body.email,
                html: `<p>Please confirm your mail by link <a href="${baseUrl + randomHash}">Confirm</a></p>`
            })
        } catch(error) {
            console.log("Signup error:", error);
            throw new InternalServerErrorException();
        }
    } 
    
    async confirmUserAccountByMailHash(hash: string) {
        const userIdInStore = await this.cacheManager.get(hash);

        if(!userIdInStore) {
            throw new NotFoundException({ message: "User not found" });
        }
        const userInDb = await this.userServiceDb.findById(Number(userIdInStore));

        if(!userInDb) {
            throw new NotFoundException({ message: "User not found" });
        }
        await this.userServiceDb.updateById(Number(userIdInStore), { isConfirmed: true });
        await this.cacheManager.del(hash);
    }
}

