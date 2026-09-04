import { Type } from "class-transformer";
import { IsInt } from "class-validator";

export class DeleteSubjectDto {
    @Type(() => Number)
    @IsInt()
    subjectId!: number;

    @Type(() => Number)
    @IsInt()
    categoryId!: number;
}