import { Type } from "class-transformer";
import { IsDateString, IsInt, Min, Max } from "class-validator";

export class GetUserSingleSlotsCountDto {
    @IsDateString()
    dateFrom!: string;
    
    @IsDateString()
    dateTo!: string;
    
    @Type(() => Number)
    @IsInt()
    subjectId!: number;
}

