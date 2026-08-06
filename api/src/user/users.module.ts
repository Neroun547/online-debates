import { Module } from "@nestjs/common";
import { SignupModule } from "./signup/signup.module";
import { AuthModule } from "./auth/auth.module";
import { UserService } from "./service/users.service";
import { UsersController } from "./users.controller";
import { UserModuleDb } from "src/db/user/user.module";
import { MailerModule } from "src/integrations/mailer/mailer.module";

@Module({
    imports: [SignupModule, AuthModule, UserModuleDb, MailerModule],
    providers: [UserService],
    controllers: [UsersController]
})
export class UserModule {}
