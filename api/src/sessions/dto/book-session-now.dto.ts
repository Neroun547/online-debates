import { IsInt } from "class-validator";

export class BookSessionNowDto {
    @IsInt()
    userId!: number;

    @IsInt()
    subjectId!: number;

    @IsInt()
    categoryId!: number;
}
