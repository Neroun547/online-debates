import { Module } from "@nestjs/common";
import { CategoryModuleDb } from "src/db/category/category.module";
import { CategoriesController } from "./categories.controller";
import { CategoriesService } from "./service/categories.service";
import { AdminCategoriesController } from "./admin-categories.controller";
import { CategoriesTranslatesModuleDb } from "src/db/translates/categories/categories-translates.module";

@Module({
    imports: [CategoryModuleDb, CategoriesTranslatesModuleDb],
    controllers: [CategoriesController, AdminCategoriesController],
    providers: [CategoriesService]
})
export class CategoriesModule {}
