import { IsString } from "class-validator";

export class PasswordRecoveryDto {
    @IsString()
    password!: string;
}
