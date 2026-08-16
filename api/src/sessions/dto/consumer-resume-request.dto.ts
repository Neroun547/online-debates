import { IsString } from "class-validator";

export class ConsumerResumeRequestDto {
    @IsString()
    consumerId!: string;
}

