import { IsInt, IsString, Length } from "class-validator";

export class UpdateCategoryDto {
    @IsString()
    @Length(1, 500)
    translateNameUk!: string;

    @IsString()
    @Length(1, 500)
    translateNameEn!: string;

    @IsString()
    @Length(1, 500)
    translateNameRu!: string;

    @IsInt()
    priority!: number;
}

