import { IsString, Length } from "class-validator";

export class UpdateUserPassword {
    @IsString()
    @Length(8, 50)
    oldPassword!: string;

    @IsString() 
    @Length(8, 50)
    newPassword!: string;

    @IsString()
    @Length(8, 50)
    confirmNewPassword!: string;
}

