import { IsEmail } from "class-validator";

export class SendPasswordRecoveryLink {
    @IsEmail()
    email!: string;
}
