import { IsEmail, IsString, Length } from "class-validator";

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
}

