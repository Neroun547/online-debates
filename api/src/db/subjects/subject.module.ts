import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Subject } from "./subject.entity";
import { SubjectServiceDb } from "./subject.service";

@Module({
    imports: [TypeOrmModule.forFeature([Subject])],
    providers: [SubjectServiceDb],
    exports: [SubjectServiceDb]
})
export class SubjectModuleDb {

}

