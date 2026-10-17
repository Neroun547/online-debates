import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { AuthDto } from "../dto/auth.dto";
import { AdminServiceDb } from "src/db/admin/admin.service";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { createHmac } from "crypto";

@Injectable()
export class AdminAuthService {
    constructor(
        private adminServiceDb: AdminServiceDb,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async auth(
        data: AuthDto,
    ): Promise<{ token: string; id: number; email: string }> {
        const adminInDb = await this.adminServiceDb.findByEmailWithSecureParams(
            data.email,
        );

        if (!adminInDb) {
            throw new NotFoundException({
                message: "Admin with this email not found",
            });
        }
        if (!this.validatePassword(data.password, adminInDb.password)) {
            throw new BadRequestException({ message: "Invalid password" });
        }
        const jwtSecret = this.configService.getOrThrow(
            "ADMIN_AUTH_JWT_SECRET",
        );
        const token = await this.jwtService.signAsync(
            { id: adminInDb.id },
            { secret: jwtSecret, expiresIn: "7d" },
        );

        return {
            token: token,
            id: adminInDb.id,
            email: adminInDb.email,
        };
    }

    validatePassword(password: string, hash: string): boolean {
        const hashAlg = this.configService.getOrThrow(
            "ADMIN_AUTH_HASH_ALGORITHM",
        );
        const hashKey = this.configService.getOrThrow(
            "ADMIN_AUTH_PASSWORD_SECRET",
        );

        const passwordToHash = createHmac(hashAlg, hashKey)
            .update(password)
            .digest("hex");

        return passwordToHash === hash;
    }
}
