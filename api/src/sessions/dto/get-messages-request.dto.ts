import { Type } from "class-transformer";
import { IsInt, Max, Min } from "class-validator";

export class GetMessagesRequestDto {
    @Type(() => Number)
    @IsInt()
    @Max(20)
    @Min(1)
    limit!: number;

    @Type(() => Number)
    @IsInt()
    @Min(0)
    skip!: number;
}

