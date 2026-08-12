import { Type } from "class-transformer";
import { IsInt, Max, Min } from "class-validator";

export class GetSubjectUsersRequestDto {
    @Type(() => Number)
    @IsInt() 
    subjectId!: number;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    page!: number;

    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(20)
    limit!: number;
}

