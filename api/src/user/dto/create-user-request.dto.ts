import { IsEmail, IsEnum, IsInt, IsOptional, IsString, Length } from "class-validator";
import { UserSex } from "src/db/user/user.entity";

export class CreateUserRequestDto {
    @IsString()
    @Length(6, 50)
    username!: string;
    
    @IsEmail()
    email!: string;
    
    @IsString()
    @Length(1, 50)
    timezone!: string;

    @IsString()
    @Length(8, 50)
    password!: string;

    @IsInt()
    age!: number;

    @IsOptional()
    @IsString()
    @Length(1, 5000)
    description?: string;

    @IsEnum(UserSex)
    sex!: UserSex;
}

