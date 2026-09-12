import { BadRequestException, Body, Controller, Patch, UseGuards } from "@nestjs/common";
import { AdminAuthGuard } from "./auth/admin-auth.guard";
import { AdminService } from "./service/admin.service";
import { UpdateAdminEmailDto } from "./dto/update-admin-email.dto";
import { UpdateAdminPasswordDto } from "./dto/update-admin-password.dto";
import { Admin } from "./auth/decorators/admin.decorator";
import type { AdminDomainInterface } from "src/db/admin/interfaces/admin.interfaces";

@UseGuards(AdminAuthGuard)
@Controller("/admin")
export class AdminController {
    constructor(private adminService: AdminService) {

    }

    @Patch("email")
    async updateAdminEmail(@Admin() admin: AdminDomainInterface, @Body() body: UpdateAdminEmailDto) {
        await this.adminService.updateAdminEmail(admin.id, body.email);

        return;
    }

    @Patch("password")
    async updateAdminPassword(@Admin() admin: AdminDomainInterface, @Body() body: UpdateAdminPasswordDto) {
        if(body.newPassword.trim() !== body.confirmNewPassword.trim()) {
            throw new BadRequestException({ message: "New password and confirm password are not the same" });
        }
        await this.adminService.updateAdminPassword({
            adminId: admin.id,
            oldPassword: body.oldPassword,
            newPassword: body.newPassword
        });

        return;
    }
}
