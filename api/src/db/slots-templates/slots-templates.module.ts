import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { SlotsTemplates } from "./slots-templates.entity";
import { SlotsTemplatesServiceDb } from "./slots-templates.service";
import { SlotsModuleDb } from "../slots/slots.module";

@Module({
    imports: [TypeOrmModule.forFeature([SlotsTemplates]), SlotsModuleDb],
    providers: [SlotsTemplatesServiceDb],
    exports: [SlotsTemplatesServiceDb]
})
export class SlotsTemplatesModuleDb {

}
