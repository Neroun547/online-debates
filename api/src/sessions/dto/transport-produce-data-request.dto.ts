import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import type { SctpStreamParameters } from "mediasoup/types";

export class TransportProduceDataRequestDto {
    @IsString()
    transportId!: string;

    @IsNotEmpty()
    sctpStreamParameters!: SctpStreamParameters;

    @IsOptional()
    @IsString()
    label?: string | undefined;

    @IsOptional()
    @IsString()
    protocol?: string | undefined;
}
