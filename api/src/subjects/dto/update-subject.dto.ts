import { IsInt, IsString, Length } from "class-validator";

export class UpdateSubjectDto {
    @IsString()
    @Length(1, 500)
    name!: string;

    @IsInt()
    categoryId!: number;
}

