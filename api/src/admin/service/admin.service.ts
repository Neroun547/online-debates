import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { AdminServiceDb } from "src/db/admin/admin.service";
import { AdminAuthService } from "../auth/service/admin-auth.service";
import { createHmac } from "crypto";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AdminService {
    constructor(
        private adminServiceDb: AdminServiceDb,
        private adminAuthService: AdminAuthService,
        private configService: ConfigService
    ) {

    }

    async updateAdminEmail(adminId: number, newEmail: string) {
        const adminInDb = await this.adminServiceDb.findById(adminId);

        if(!adminInDb) {
            throw new NotFoundException({ message: "Admin not found" });
        }
        const adminInDbWithTheSameEmail = await this.adminServiceDb.findByEmail(newEmail);

        if(adminInDbWithTheSameEmail && adminInDb.id !== adminInDbWithTheSameEmail.id) {
            throw new BadRequestException({ message: "Admin with the same email already exists in db" });
        }
        await this.adminServiceDb.updateById(adminId, { email: newEmail });
    }
    async updateAdminPassword(params: {
        adminId: number;
        oldPassword: string;
        newPassword: string;
    }) {
        const adminInDb = await this.adminServiceDb.findByIdWithSecureParams(params.adminId);

        if(!adminInDb) {
            throw new NotFoundException({ message: "Admin not found" });
        }
        const isOldPasswordValid = this.adminAuthService.validatePassword(params.oldPassword, adminInDb.password);

        if(!isOldPasswordValid) {
            throw new ForbiddenException({ message: "Old password not valid" });
        }
        const hashAlg = this.configService.getOrThrow("ADMIN_AUTH_HASH_ALGORITHM");
        const hashKey = this.configService.getOrThrow("ADMIN_AUTH_PASSWORD_SECRET");

        const newPasswordHash = createHmac(hashAlg, hashKey).update(params.newPassword).digest("hex");

        await this.adminServiceDb.updateById(params.adminId, { password: newPasswordHash });
    }   
}

