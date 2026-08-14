import { Type } from "class-transformer";
import { IsDateString, IsEnum, IsInt, Max, Min } from "class-validator";

export enum GetAllUserSessionsStatus {
    ALL="all",
    BOOKED_WITH_ME="booked_with_me",
    MY_BOOKING="my_booking"
}

export class GetAllUserSessionsRequestDto {
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

    @IsEnum(GetAllUserSessionsStatus)
    status!: GetAllUserSessionsStatus;
}

