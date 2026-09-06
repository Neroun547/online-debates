import { BadRequestException, Body, Controller, Patch, Req, UseGuards } from "@nestjs/common";
import { AdminAuthGuard } from "./auth/admin-auth.guard";
import { AdminService } from "./service/admin.service";
import { UpdateAdminEmailDto } from "./dto/update-admin-email.dto";
import { UpdateAdminPasswordDto } from "./dto/update-admin-password.dto";

@UseGuards(AdminAuthGuard)
@Controller("/admin")
export class AdminController {
    constructor(private adminService: AdminService) {

    }

    @Patch("email")
    async updateAdminEmail(@Req() req: Request, @Body() body: UpdateAdminEmailDto) {
        await this.adminService.updateAdminEmail(req["user"].id, body.email);

        return;
    }

    @Patch("password")
    async updateAdminPassword(@Req() req: Request, @Body() body: UpdateAdminPasswordDto) {
        if(body.newPassword.trim() !== body.confirmNewPassword.trim()) {
            throw new BadRequestException({ message: "New password and confirm password are not the same" });
        }
        await this.adminService.updateAdminPassword({
            adminId: req["user"].id,
            oldPassword: body.oldPassword,
            newPassword: body.newPassword
        });

        return;
    }
}

