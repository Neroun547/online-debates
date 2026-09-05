import { IsInt, IsOptional, IsString, Length } from "class-validator";

export class AdminUpdateSubjectDto {
    @IsString()
    @Length(1, 500)
    name!: string;
    
    @IsInt()
    categoryId!: number;

    @IsOptional()
    @IsInt()
    userId?: number;
}

