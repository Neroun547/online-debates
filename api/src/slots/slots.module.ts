import { Module } from "@nestjs/common";
import { SlotsController } from "./slots.controller";
import { SlotsService } from "./service/slots.service";
import { SlotsModuleDb } from "src/db/slots/slots.module";
import { SlotsTemplatesModuleDb } from "src/db/slots-templates/slots-templates.module";
import { CategoryModuleDb } from "src/db/category/category.module";
import { SubjectModuleDb } from "src/db/subjects/subject.module";
import { UsersSlotsController } from "./users-slots.controller";

@Module({
    imports: [SlotsModuleDb, SlotsTemplatesModuleDb, CategoryModuleDb, SubjectModuleDb],
    controllers: [SlotsController, UsersSlotsController],
    providers: [SlotsService]
})
export class SlotsModule {}
