import { Module } from "@nestjs/common";
import { UserSessionsController } from "./user-sessions.controller";
import { SessionsService } from "./service/sessions.service";
import { SlotsModuleDb } from "src/db/slots/slots.module";
import { UserModuleDb } from "src/db/user/user.module";
import { SessionsModuleDb } from "src/db/sessions/sessions.module";
import { WebRTCModule } from "src/integrations/webRTC/webRTC.module";
import { WebRTCController } from "./webRTC.controller";
import { SessionsGateway } from "./sessions.gateway";

@Module({
    imports: [SlotsModuleDb, UserModuleDb, SessionsModuleDb, WebRTCModule],
    providers: [SessionsService, SessionsGateway],
    controllers: [UserSessionsController, WebRTCController],
    exports: [SessionsService]
})
export class SessionsModule {}
