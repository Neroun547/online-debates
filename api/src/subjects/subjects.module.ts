import { Module } from "@nestjs/common";
import { SubjectsController } from "./subjects.controller";
import { SubjectsService } from "./service/subjects.service";
import { SubjectModuleDb } from "src/db/subjects/subject.module";
import { CategoryModuleDb } from "src/db/category/category.module";
import { UsersSubjectsController } from "./user-subjects.controller";
import { UserModuleDb } from "src/db/user/user.module";
import { AdminModuleDb } from "src/db/admin/admin.module";
import { AdminSubjectsController } from "./admin-subjects.controller";

@Module({
    imports: [SubjectModuleDb, CategoryModuleDb, UserModuleDb, AdminModuleDb],
    controllers: [SubjectsController, UsersSubjectsController, AdminSubjectsController],
    providers: [SubjectsService]
})
export class SubjectsModule {}
