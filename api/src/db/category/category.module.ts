import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Category } from "./category.entity";
import { CategoryServiceDb } from "./category.service";

@Module({
    imports: [TypeOrmModule.forFeature([Category])],
    providers: [CategoryServiceDb],
    exports: [CategoryServiceDb],
})
export class CategoryModuleDb {}
