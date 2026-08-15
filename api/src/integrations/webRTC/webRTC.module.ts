import { Module } from "@nestjs/common";
import { WebRTCService } from "./webRTC.service";

@Module({
    providers: [WebRTCService],
    exports: [WebRTCService]
})
export class WebRTCModule {}
