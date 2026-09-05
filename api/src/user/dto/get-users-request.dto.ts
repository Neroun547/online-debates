import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class GetUsersRequestDto {
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page!: number;

    @Type(() => Number)
    @IsInt()
    @Max(20)
    @Min(1)
    limit!: number;

    @IsOptional()
    @IsString()
    searchUsername!: string;
}

