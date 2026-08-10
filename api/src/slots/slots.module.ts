import { Module } from "@nestjs/common";
import { SlotsController } from "./slots.controller";
import { SlotsService } from "./service/slots.service";
import { SlotsModuleDb } from "src/db/slots/slots.module";
import { SlotsTemplatesModuleDb } from "src/db/slots-templates/slots-templates.module";
import { CategoryModuleDb } from "src/db/category/category.module";
import { SubjectModuleDb } from "src/db/subjects/subject.module";
import { UsersSlotsController } from "./users-slots.controller";
import { UserModuleDb } from "src/db/user/user.module";

@Module({
    imports: [SlotsModuleDb, SlotsTemplatesModuleDb, CategoryModuleDb, SubjectModuleDb, UserModuleDb],
    controllers: [SlotsController, UsersSlotsController],
    providers: [SlotsService]
})
export class SlotsModule {}
