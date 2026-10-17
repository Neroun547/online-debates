import { Type } from "class-transformer";
import { IsDateString, IsInt } from "class-validator";

export class GetSlotsForBookingRequestDto {
    @Type(() => Number)
    @IsInt()
    subjectId!: number;

    @Type(() => Number)
    @IsInt()
    userId!: number;

    @IsDateString()
    dateFrom!: string;

    @IsDateString()
    dateTo!: string;
}
