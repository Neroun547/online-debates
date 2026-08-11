import { SessionsDomainInterface } from "src/db/sessions/interfaces/sessions.interfaces";

export interface SlotsInterface {
    id?: number;
    startTime: Date;
    endTime: Date;
    userId: number;
    subjectId: number;
    slotsTemplateId: number | null;
}

export interface SlotDomainInterface {
    id: number;
    startTime: Date;
    endTime: Date;
    userId: number;
    subjectId: number;
    slotsTemplateId: number | null;
    session?: SessionsDomainInterface;
}

