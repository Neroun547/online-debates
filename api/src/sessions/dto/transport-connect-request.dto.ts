import { IsEnum, IsInt, IsNotEmpty, IsString } from "class-validator";
import type { DtlsParameters } from "mediasoup/types";
import { WebRTCTransporterDirection } from "./init-webRTC-session-request.dto";

export class TransportConnectRequestDto {
    @IsString()    
    transportId!: string;

    @IsNotEmpty()
    dtlsParameters!: DtlsParameters;
    
    @IsInt()
    sessionId!: number;

    @IsEnum(WebRTCTransporterDirection)
    direction!: WebRTCTransporterDirection;
}

