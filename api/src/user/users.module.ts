import { Module } from "@nestjs/common";
import { SignupModule } from "./signup/signup.module";
import { AuthModule } from "./auth/auth.module";
import { UserService } from "./service/users.service";
import { UsersController } from "./users.controller";
import { UserModuleDb } from "src/db/user/user.module";
import { MailerModule } from "src/integrations/mailer/mailer.module";
import { UserStateWebsocketGateway } from "./user.gateway";
import { AdminUsersController } from "./admin-user.controller";
import { UserController } from "./user.controller";

@Module({
    imports: [SignupModule, AuthModule, UserModuleDb, MailerModule],
    providers: [UserService, UserStateWebsocketGateway],
    controllers: [UsersController, AdminUsersController, UserController],
})
export class UserModule {}
