import { IsInt, IsString, Length } from "class-validator";

export class SaveCategoryDto {
    @IsString()
    @Length(1, 500)
    name!: string;

    @IsInt()
    priority!: number;
}

