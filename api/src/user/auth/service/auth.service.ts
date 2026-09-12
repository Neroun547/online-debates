import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { AuthDto } from "../dto/auth.dto";
import { JwtService } from "@nestjs/jwt";
import { UserServiceDb } from "src/db/user/user.service";
import { ConfigService } from "@nestjs/config";
import { createHmac } from "crypto";
import { UserStatus } from "src/db/user/user.entity";

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private usersServiceDb: UserServiceDb,
        private configService: ConfigService
    ) {}

    async auth(body: AuthDto): Promise<{ token: string; userId: number; isOnline: boolean; }> {
        const userInDb = await this.usersServiceDb.findByEmailOrUsernameWithSecureParams(body.usernameOrEmail);

        if(!userInDb) {
            throw new NotFoundException({ message: "User not found" });
        }
        if(userInDb && !userInDb.isConfirmed) {
            throw new BadRequestException({ message: "User account not confirmed" });
        }
        if(!this.checkPassword(userInDb.password, body.password)) {
            throw new ForbiddenException({ message: "Invalid password" });
        }
        const token = await this.jwtService.signAsync(
            { 
                id: userInDb.id, 
                email: userInDb.email, 
                username: userInDb.username,
                timezone: userInDb.timezone,
                isAvailableForInstantMeeting: userInDb.isAvailableForInstantMeeting
            }, 
            { 
                secret: this.configService.getOrThrow("USER_AUTH_JWT_SECRET"),
                expiresIn: this.configService.getOrThrow("USER_AUTH_JWT_EXPIRES_IN") 
            }
        );
        await this.usersServiceDb.updateById(userInDb.id ?? 0, { status: UserStatus.ONLINE });
        
        return {
            token: token,
            userId: userInDb.id ?? 0,
            isOnline: true
        };
    }
    private checkPassword(hash: string, password: string): boolean {
        const hashKey = this.configService.getOrThrow("PASSWORD_HASH_KEY");
        const hashAlg = this.configService.getOrThrow("PASSWORD_HASH_ALGORITHM");

        const passwordToHash = createHmac(hashAlg, hashKey).update(password).digest("hex");

        return hash === passwordToHash;
    }
}

