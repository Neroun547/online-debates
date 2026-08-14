import { Module } from "@nestjs/common";
import { UserSessionsController } from "./user-sessions.controller";
import { SessionsService } from "./service/sessions.service";
import { SlotsModuleDb } from "src/db/slots/slots.module";
import { UserModuleDb } from "src/db/user/user.module";
import { SessionsModuleDb } from "src/db/sessions/sessions.module";

@Module({
    imports: [SlotsModuleDb, UserModuleDb, SessionsModuleDb],
    providers: [SessionsService],
    controllers: [UserSessionsController],
    exports: [SessionsService]
})
export class SessionsModule {}
