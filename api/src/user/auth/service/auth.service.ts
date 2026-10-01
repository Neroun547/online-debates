import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { AuthDto } from "../dto/auth.dto";
import { JwtService } from "@nestjs/jwt";
import { UserServiceDb } from "src/db/user/user.service";
import { ConfigService } from "@nestjs/config";
import { createHmac } from "crypto";
import { UserStatus } from "src/db/user/user.entity";
import { UserDomainInterface } from "src/db/user/interfaces/user.interfaces";
import { AuthResponseDto } from "../dto/auth-response.dto";

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private usersServiceDb: UserServiceDb,
        private configService: ConfigService
    ) {}

    async generateJwtToken(params: UserDomainInterface) {
        return await this.jwtService.signAsync({
            ...params
        }, { secret: this.configService.getOrThrow("USER_AUTH_JWT_SECRET"), expiresIn: this.configService.getOrThrow("USER_AUTH_JWT_EXPIRES_IN") });
    }
    async auth(body: AuthDto): Promise<AuthResponseDto> {
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
                avatarFilename: userInDb.avatarFilename,
                age: userInDb.age,
                description: userInDb.description,
                sex: userInDb.sex
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
    async refreshAuthToken(userId: number): Promise<AuthResponseDto> {
        const userInDb = await this.usersServiceDb.findById(userId);

        if(!userInDb) {
            throw new NotFoundException({ message: "User not found" });
        }
        const newToken = await this.generateJwtToken({
            id: userInDb.id,
            username: userInDb.username,
            email: userInDb.email,
            status: UserStatus.ONLINE,
            timezone: userInDb.timezone,
            language: userInDb.language,
            avatarFilename: userInDb.avatarFilename,
            isAvailableForPermanentSessions: userInDb.isAvailableForPermanentSessions,
            age: userInDb.age,
            description: userInDb.description,
            sex: userInDb.sex
        });

        return {
            token: newToken,
            userId: userInDb.id,
            isOnline: userInDb.status === UserStatus.ONLINE,
            language: userInDb.language,
            avatarFilename: userInDb.avatarFilename
        }
    }
    private checkPassword(hash: string, password: string): boolean {
        const hashKey = this.configService.getOrThrow("PASSWORD_HASH_KEY");
        const hashAlg = this.configService.getOrThrow("PASSWORD_HASH_ALGORITHM");

        const passwordToHash = createHmac(hashAlg, hashKey).update(password).digest("hex");

        return hash === passwordToHash;
    }
}

