import { Type } from "class-transformer";
import { IsInt, Max, Min } from "class-validator";

export class GetSubjectsRequestDto {
    @Type(() => Number)
    @Min(1)
    @IsInt()
    page!: number;

    @Type(() => Number)
    @Max(20)
    @IsInt()
    limit!: number;
}
