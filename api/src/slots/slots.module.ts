import { Module } from "@nestjs/common";
import { SlotsController } from "./slots.controller";
import { SlotsService } from "./service/slots.service";
import { SlotsModuleDb } from "src/db/slots/slots.module";
import { SlotsTemplatesModuleDb } from "src/db/slots-templates/slots-templates.module";
import { CategoryModuleDb } from "src/db/category/category.module";
import { SubjectModuleDb } from "src/db/subjects/subject.module";
import { UsersSlotsController } from "./user-slots.controller";
import { UserModuleDb } from "src/db/user/user.module";
import { BookingSlotsController } from "./booking-slots.controller";
import { SlotsSchedule } from "./slots.schedule";
import { SessionsModule } from "src/sessions/sessions.module";
import { SessionsModuleDb } from "src/db/sessions/sessions.module";

@Module({
    imports: [SlotsModuleDb, SlotsTemplatesModuleDb, CategoryModuleDb, SubjectModuleDb, UserModuleDb, SessionsModule, SessionsModuleDb],
    controllers: [SlotsController, UsersSlotsController, BookingSlotsController],
    providers: [SlotsService, SlotsSchedule]
})
export class SlotsModule {}
