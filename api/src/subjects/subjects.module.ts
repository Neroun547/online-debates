import { Module } from "@nestjs/common";
import { SubjectsController } from "./subjects.controller";
import { SubjectsService } from "./service/subjects.service";
import { SubjectModuleDb } from "src/db/subjects/subject.module";
import { CategoryModuleDb } from "src/db/category/category.module";

@Module({
    imports: [SubjectModuleDb, CategoryModuleDb],
    controllers: [SubjectsController],
    providers: [SubjectsService]
})
export class SubjectsModule {}
