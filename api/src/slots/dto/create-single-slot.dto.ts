import { IsDateString, IsInt } from "class-validator";

export class CreateSingleSlotDto {
    @IsInt()
    subjectId!: number;

    @IsDateString()
    startTime!: string;

    @IsDateString()
    endTime!: string;
}
