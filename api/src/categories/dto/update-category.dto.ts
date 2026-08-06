import { IsInt, IsString, Length } from "class-validator";

export class UpdateCategoryDto {
    @IsString()
    @Length(1, 500)
    name!: string;

    @IsInt()
    priority!: number;
}

