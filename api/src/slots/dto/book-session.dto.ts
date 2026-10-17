import { IsDateString, IsInt } from "class-validator";

export class BookSessionDto {
    @IsInt()
    slotId!: number;

    @IsDateString()
    currentUserDateTime!: string;
}
