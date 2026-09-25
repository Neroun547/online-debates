import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CategoriesTranslates } from "./categories-translates.entity";
import { CategoriesTranslatesServiceDb } from "./categories-translates.service";

@Module({
    imports: [TypeOrmModule.forFeature([CategoriesTranslates])],
    providers: [CategoriesTranslatesServiceDb],
    exports: [CategoriesTranslatesServiceDb]
})
export class CategoriesTranslatesModuleDb {}
