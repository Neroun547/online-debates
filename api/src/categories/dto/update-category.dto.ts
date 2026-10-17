import { IsInt, IsOptional, IsString, Length } from "class-validator";

export class UpdateCategoryDto {
    @IsOptional()
    @Length(1, 255)
    @IsString()
    emoji?: string;
  
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
