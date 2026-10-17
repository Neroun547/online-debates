import {
    IsEmail,
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    Length,
    Min,
} from "class-validator";
import { UserSex } from "src/db/user/user.entity";

export class AdminUpdateUserDto {
    @IsString()
    @Length(6, 50)
    username!: string;

    @IsEmail()
    email!: string;

    @IsString()
    timezone!: string;

    @IsOptional()
    @IsString()
    @Length(8, 50)
    password?: string;

    @IsInt()
    @Min(18)
    age!: number;

    @IsString()
    @Length(0, 5000)
    description!: string;

    @IsEnum(UserSex)
    sex!: UserSex;
}
