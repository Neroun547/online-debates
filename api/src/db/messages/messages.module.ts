import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Messages } from "./messages.entity";
import { MessagesServiceDb } from "./messages.service";

@Module({
    imports: [TypeOrmModule.forFeature([Messages])],
    providers: [MessagesServiceDb],
    exports: [MessagesServiceDb],
})
export class MessagesModuleDb {}
