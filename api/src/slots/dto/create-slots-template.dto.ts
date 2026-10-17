import { Type } from "class-transformer";
import {
    ArrayMinSize,
    IsArray,
    IsInt,
    IsMilitaryTime,
    Max,
    Min,
    ValidateNested,
} from "class-validator";

export class SlotItemInTemplateDto {
    @IsInt()
    @Min(1)
    @Max(7)
    weekday!: number;

    @IsMilitaryTime({
        message: "startTime must have HH:mm format",
    })
    startTime!: string;

    @IsMilitaryTime({
        message: "endTime must have HH:mm format",
    })
    endTime!: string;
}

export class CreateSlotsTemplateDto {
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => SlotItemInTemplateDto)
    slots!: SlotItemInTemplateDto[];

    @IsInt()
    subjectId!: number;

    @IsInt()
    categoryId!: number;
}
