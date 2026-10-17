import { Module } from "@nestjs/common";
import { SignupController } from "./signup.controller";
import { SignupService } from "./service/signup.service";
import { UserModuleDb } from "src/db/user/user.module";
import { MailerModule } from "src/integrations/mailer/mailer.module";

@Module({
    imports: [UserModuleDb, MailerModule],
    controllers: [SignupController],
    providers: [SignupService],
})
export class SignupModule {}
