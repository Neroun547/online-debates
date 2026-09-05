import { IsEmail, IsOptional, IsString, Length } from "class-validator";

export class AdminUpdateUserDto {
    @IsString()
    @Length(6, 50)
    username!: string;

    @IsEmail()
    email!: string;

    @IsString()
    timezone!: string;

    @IsOptional()
    @IsString()
    @Length(8, 50)
    password?: string;
}

