import { IsEnum } from "class-validator";
import { UserStatus } from "src/db/user/user.entity";

export class UpdateUserOnlineStatusDto {
    @IsEnum(UserStatus)
    status!: UserStatus;
}
