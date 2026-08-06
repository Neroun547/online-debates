import { IsEmail, IsOptional, IsString, Length } from "class-validator";

export class UpdateUserPersonalDataDto {
    @IsOptional()
    @IsString()
    @Length(6, 50)
    username?: string;

    @IsOptional()
    @IsEmail()
    email?: string;
}

