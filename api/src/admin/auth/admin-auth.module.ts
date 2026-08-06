import { Module } from "@nestjs/common";
import { AdminAuthService } from "./service/admin-auth.service";
import { AdminAuthController } from "./admin-auth.controller";
import { AdminModuleDb } from "src/db/admin/admin.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [
        AdminModuleDb,
    ],
    providers: [AdminAuthService],
    controllers: [AdminAuthController]
})
export class AdminAuthModule {

}
