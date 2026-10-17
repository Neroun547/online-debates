import { Type } from "class-transformer";
import {
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    Length,
    Max,
} from "class-validator";

export enum FindUsersRequestSexParamEnum {
    MALE = "male",
    FEMALE = "female",
    ALL = "all",
}

export class FindUsersRequestDto {
    @IsOptional()
    @Length(1, 500)
    @IsString()
    usernameOrEmail?: string;

    @Type(() => Number)
    @IsOptional()
    @IsInt()
    ageFrom?: number;

    @Type(() => Number)
    @IsOptional()
    @IsInt()
    ageTo?: number;

    @IsEnum(FindUsersRequestSexParamEnum)
    sex!: FindUsersRequestSexParamEnum;

    @Type(() => Number)
    @IsInt()
    page!: number;

    @Type(() => Number)
    @IsInt()
    @Max(20)
    limit!: number;
}
