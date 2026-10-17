import { Module } from "@nestjs/common";
import { SupportController } from "./support.controller";
import { SupportService } from "./service/support.service";
import { SupportModuleDb } from "src/db/support/support.module";
import { AdminSupportController } from "./admin-support.controller";

@Module({
    imports: [SupportModuleDb],
    controllers: [SupportController, AdminSupportController],
    providers: [SupportService],
})
export class SupportModule {}
