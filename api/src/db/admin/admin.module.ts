import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Admin } from "./admin.entity";
import { AdminServiceDb } from "./admin.service";

@Module({
    imports: [TypeOrmModule.forFeature([Admin])],
    providers: [AdminServiceDb],
    exports: [AdminServiceDb]
})
export class AdminModuleDb {}
