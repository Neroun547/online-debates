export interface SlotsTemplatesInterface {
    id?: number;
    weekday: number;
    startTime: string;
    endTime: string;
    userId: number;
    subjectId: number;
    lastSlotCreation: Date;
    
}

export interface SlotsTemplatesDomainInterface {
    id: number;
    weekday: number;
    startTime: string;
    endTime: string;
    userId: number;
    subjectId: number;
    lastSlotCreation: Date;
}
