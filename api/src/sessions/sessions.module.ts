import { Module } from "@nestjs/common";
import { UserSessionsController } from "./user-sessions.controller";
import { SessionsService } from "./service/sessions.service";
import { SlotsModuleDb } from "src/db/slots/slots.module";
import { UserModuleDb } from "src/db/user/user.module";
import { SessionsModuleDb } from "src/db/sessions/sessions.module";
import { WebRTCModule } from "src/integrations/webRTC/webRTC.module";
import { WebRTCController } from "./webRTC.controller";
import { SessionsGateway } from "./sessions.gateway";
import { MessagesModuleDb } from "src/db/messages/messages.module";
import { UserSessionsChatController } from "./user-sessions-chat.controller";
import { SessionsController } from "./sessions.controller";
import { SessionsSchedule } from "./sessions.schedule";
import { MailerModule } from "src/integrations/mailer/mailer.module";

@Module({
    imports: [SlotsModuleDb, UserModuleDb, SessionsModuleDb, WebRTCModule, MessagesModuleDb, MailerModule],
    providers: [SessionsService, SessionsGateway, SessionsSchedule],
    controllers: [UserSessionsController, WebRTCController, UserSessionsChatController, SessionsController],
    exports: [SessionsService]
})
export class SessionsModule {}
