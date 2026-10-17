import { IsNotEmpty, IsString } from "class-validator";
import type { RtpCapabilities } from "mediasoup/types";

export class ConsumeRequestDto {
    @IsString()
    producerId!: string;

    @IsNotEmpty()
    rtpCapabilities!: RtpCapabilities;
}
