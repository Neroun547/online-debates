import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { AuthDto } from "../dto/auth.dto";
import { JwtService } from "@nestjs/jwt";
import { UserServiceDb } from "src/db/user/user.service";
import { ConfigService } from "@nestjs/config";
import { createHmac } from "crypto";
import { UserStatus } from "src/db/user/user.entity";
import { UserDomainInterface } from "src/db/user/interfaces/user.interfaces";

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private usersServiceDb: UserServiceDb,
        private configService: ConfigService
    ) {}

    async generateJwtToken(params: UserDomainInterface) {
        return await this.jwtService.signAsync({
            id: params.id,
            email: params.email,
            username: params.username,
            timezone: params.timezone,
            isAvailableForPermanentSessions: params.isAvailableForPermanentSessions
        }, { secret: this.configService.getOrThrow("USER_AUTH_JWT_SECRET"), expiresIn: this.configService.getOrThrow("USER_AUTH_JWT_EXPIRES_IN") });
    }
    async auth(body: AuthDto): Promise<{ token: string; userId: number; isOnline: boolean; language: string | null; avatarFilename: string | null }> {
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
        const token = await this.generateJwtToken(
            {
                id: userInDb.id ?? 0,
                email: userInDb.email,
                username: userInDb.username,
                timezone: userInDb.timezone,
                isAvailableForPermanentSessions: userInDb.isAvailableForPermanentSessions,
                status: UserStatus.ONLINE,
                language: userInDb.language,
                avatarFilename: userInDb.avatarFilename
            }
        );
        await this.usersServiceDb.updateById(userInDb.id ?? 0, { status: UserStatus.ONLINE });
        
        return {
            token: token,
            userId: userInDb.id ?? 0,
            isOnline: true,
            language: userInDb.language,
            avatarFilename: userInDb.avatarFilename
        };
    }
    private checkPassword(hash: string, password: string): boolean {
        const hashKey = this.configService.getOrThrow("PASSWORD_HASH_KEY");
        const hashAlg = this.configService.getOrThrow("PASSWORD_HASH_ALGORITHM");

        const passwordToHash = createHmac(hashAlg, hashKey).update(password).digest("hex");

        return hash === passwordToHash;
    }
}

