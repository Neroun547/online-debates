import { IsEnum } from "class-validator";

export enum WebRTCTransporterDirection {
    RECV="recv",
    SEND="send"
}

export class InitWebRTCSessionRequestDto {
    @IsEnum(WebRTCTransporterDirection)
    direction!: WebRTCTransporterDirection;   
}

 