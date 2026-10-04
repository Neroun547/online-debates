import { Type } from "class-transformer";
import { IsInt, IsString, Max, Min } from "class-validator";

export class GetSlotsAvailableDatesRequestDto {
    @Type(() => Number)
    @IsInt()
    userId!: number;

    @Type(() => Number)
    @IsInt()
    subjectId!: number;

    @IsString()
    dateFrom!: string;

    @IsString()
    dateTo!: string;
}

