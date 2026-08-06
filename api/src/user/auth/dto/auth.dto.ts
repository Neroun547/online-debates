import { IsString, Length } from "class-validator";

export class AuthDto {
    @IsString()
    @Length(1, 256, { message: "Invalid username or email" })
    usernameOrEmail!: string;

    @IsString()
    @Length(8, 50, { message: "Invalid password" })
    password!: string;
}

