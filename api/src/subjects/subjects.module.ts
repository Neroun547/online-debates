import { Module } from "@nestjs/common";
import { SubjectsController } from "./subjects.controller";
import { SubjectsService } from "./service/subjects.service";
import { SubjectModuleDb } from "src/db/subjects/subject.module";
import { CategoryModuleDb } from "src/db/category/category.module";
import { UsersSubjectsController } from "./user-subjects.controller";
import { UserModuleDb } from "src/db/user/user.module";

@Module({
    imports: [SubjectModuleDb, CategoryModuleDb, UserModuleDb],
    controllers: [SubjectsController, UsersSubjectsController],
    providers: [SubjectsService]
})
export class SubjectsModule {}
