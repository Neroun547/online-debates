import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SlotsTemplates } from "./slots-templates.entity";
import { SlotsTemplatesServiceDb } from "./slots-templates.service";

@Module({
    imports: [TypeOrmModule.forFeature([SlotsTemplates])],
    providers: [SlotsTemplatesServiceDb],
    exports: [SlotsTemplatesServiceDb]
})
export class SlotsTemplatesModuleDb {

}
