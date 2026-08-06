import { IsInt, Max, Min } from "class-validator";
import { Type } from "class-transformer"

export class GetCategoriesDto {
    @Type(() => Number)
    @IsInt()
    @Max(20)
    @Min(1)
    limit!: number;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    page!: number;
}

