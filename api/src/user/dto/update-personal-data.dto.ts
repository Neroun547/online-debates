import { IsBoolean, IsEmail, IsOptional, IsString, Length } from "class-validator";

export class UpdateUserPersonalDataDto {
    @IsOptional()
    @IsString()
    @Length(6, 50)
    username?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    @Length(1, 50)
    timezone?: string;

    @IsOptional()
    @IsBoolean()
    isAvailableForPermanentSessions?: boolean;
}


