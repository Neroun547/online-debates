import { IsEmail, IsString, Length } from "class-validator";

export class CreateSupportMessageDto {
    @IsEmail()
    email!: string;

    @IsString()
    @Length(1, 150)
    subject!: string;

    @IsString()
    @Length(1, 5000)
    message!: string;
}

