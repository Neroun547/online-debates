import { Module } from "@nestjs/common";
import { AdminAuthModule } from "./auth/admin-auth.module";
import { AdminController } from "./admin.controller";
import { AdminService } from "./service/admin.service";
import { AdminModuleDb } from "src/db/admin/admin.module";

@Module({
    imports: [AdminAuthModule, AdminModuleDb],
    controllers: [AdminController],
    providers: [AdminService]
})
export class AdminModule {

}
