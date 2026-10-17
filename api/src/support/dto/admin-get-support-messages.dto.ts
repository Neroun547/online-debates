import { Type } from "class-transformer";
import { IsInt, Max, Min } from "class-validator";

export class AdminGetSupportMessagesDto {
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page!: number;

    @Type(() => Number)
    @IsInt()
    @Max(20)
    @Min(1)
    limit!: number;
}
