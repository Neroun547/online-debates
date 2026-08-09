import { Type } from "class-transformer";
import { IsInt } from "class-validator";

export class GetUserTemplatesDto {    
    @Type(() => Number)
    @IsInt()
    subjectId!: number;
}

