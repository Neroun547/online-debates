import { IsEnum, IsInt, IsOptional, IsString, Length } from "class-validator";
import { UserSex } from "src/db/user/user.entity";

export class UpdateUserAboutInfoDto {
    @IsInt()
    age!: number;

    @IsString()
    @IsOptional()
    @Length(1, 5000)
    description?: string;

    @IsEnum(UserSex)
    sex!: UserSex;
}
