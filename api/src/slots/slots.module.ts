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
import { SessionsService } from "./service/sessions.service";
import { SessionsModuleDb } from "src/db/sessions/sessions.module";

@Module({
    imports: [SlotsModuleDb, SlotsTemplatesModuleDb, CategoryModuleDb, SubjectModuleDb, UserModuleDb, SessionsModuleDb],
    controllers: [SlotsController, UsersSlotsController, BookingSlotsController],
    providers: [SlotsService, SessionsService]
})
export class SlotsModule {}
