import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Slots } from "./slots.entity";
import { SlotsServiceDb } from "./slots.service";

@Module({
    imports: [TypeOrmModule.forFeature([Slots])],
    providers: [SlotsServiceDb],
    exports: [SlotsServiceDb]
})
export class SlotsModuleDb {

}
