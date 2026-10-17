import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Sessions } from "./sessions.entity";
import { SessionsServiceDb } from "./sessions.service";

@Module({
    imports: [TypeOrmModule.forFeature([Sessions])],
    providers: [SessionsServiceDb],
    exports: [SessionsServiceDb],
})
export class SessionsModuleDb {}
