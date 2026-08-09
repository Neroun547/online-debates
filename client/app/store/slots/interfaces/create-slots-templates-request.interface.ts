export interface SlotItemInTemplateDto {
  weekday: number;
  startTime: string;
  endTime: string;
}

export interface CreateSlotsTemplatesRequestInterface {
  slots: SlotItemInTemplateDto[];
  subjectId: number;
  categoryId: number;
}
