import { IsEmail, IsEnum, IsInt, IsOptional, IsString, Length, Min } from "class-validator";
import { UserSex } from "src/db/user/user.entity";

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

    @IsInt()
    @Min(18)
    age!: number;

    @IsOptional()
    @IsString()
    @Length(1, 5000)
    description?: string;

    @IsEnum(UserSex)
    sex!: UserSex;
}

