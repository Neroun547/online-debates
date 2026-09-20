import { IsString, Length } from "class-validator";

export class UpdateUserLanguageDto {
    @Length(1, 10)
    @IsString()
    language!: string;
}
