import { IsInt, IsString, Length } from "class-validator";

export class CreateSubjectDto {
    @IsString()
    @Length(1, 500)
    name!: string;

    @IsInt()
    categoryId!: number;
}
