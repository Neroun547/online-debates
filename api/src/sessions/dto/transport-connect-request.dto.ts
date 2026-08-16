import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import type { DtlsParameters } from "mediasoup/types";
import { WebRTCTransporterDirection } from "./init-webRTC-session-request.dto";

export class TransportConnectRequestDto {
    @IsString()    
    transportId!: string;

    @IsNotEmpty()
    dtlsParameters!: DtlsParameters;

    @IsEnum(WebRTCTransporterDirection)
    direction!: WebRTCTransporterDirection;
}

