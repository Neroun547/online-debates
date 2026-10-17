import { IsEnum, IsNotEmpty } from "class-validator";
import type { AppData, RtpParameters } from "mediasoup/types";

export enum TransportProduceKind {
    AUDIO = "audio",
    VIDEO = "video",
}
export class TransportProduceRequestDto {
    @IsEnum(TransportProduceKind)
    kind!: TransportProduceKind;

    @IsNotEmpty()
    rtpParameters!: RtpParameters;

    @IsNotEmpty()
    appData!: AppData;
}
