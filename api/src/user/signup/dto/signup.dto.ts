import { IsEmail, IsString, Length } from "class-validator";

export class SignupDto {
    @IsEmail()
    email!: string;

    @IsString()
    @Length(6, 50)
    username!: string;

    @IsString()
    @Length(8, 50)
    password!: string;

    @IsString()
    @Length(1, 50)
    timezone!: string;
}

