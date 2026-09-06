import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Support } from "./support.entity";
import { SupportServiceDb } from "./support.service";

@Module({
    imports: [TypeOrmModule.forFeature([Support])],
    providers: [SupportServiceDb],
    exports: [SupportServiceDb]
})
export class SupportModuleDb {}
