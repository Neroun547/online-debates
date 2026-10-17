import { Type } from "class-transformer";
import { IsInt, IsOptional, Max, Min } from "class-validator";

export class GetSubjectsDto {
    @Type(() => Number)
    @IsInt()
    @Max(20)
    @Min(1)
    limit!: number;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    page!: number;

    @Type(() => Number)
    @IsInt()
    @IsOptional()
    categoryId?: number;

    @Type(() => Number)
    @IsInt()
    @IsOptional()
    userId?: number;
}
