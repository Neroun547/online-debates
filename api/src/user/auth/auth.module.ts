import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./service/auth.service";
import { JwtModule } from "@nestjs/jwt";
import { UserModuleDb } from "src/db/user/user.module";

@Module({
    imports: [
        JwtModule.register({
            //@ts-ignore
            signOptions: { expiresIn: String(process.env.USER_AUTH_JWT_EXPIRES_IN) },
            global: true
        }),
        UserModuleDb
    ],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule {}
