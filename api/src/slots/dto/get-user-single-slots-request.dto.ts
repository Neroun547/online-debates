import { Type } from "class-transformer";
import { IsDateString, IsInt, Max, Min } from "class-validator";

export class GetUserSingleSlotsDto {
    @IsDateString()
    dateFrom!: string;

    @IsDateString()
    dateTo!: string;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    page!: number;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(20)
    limit!: number;

    @Type(() => Number)
    @IsInt()
    subjectId!: number;
}

