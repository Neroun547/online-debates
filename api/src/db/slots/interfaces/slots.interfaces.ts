import { SessionsDomainInterface } from "src/db/sessions/interfaces/sessions.interfaces";
import { SubjectDomainInterface } from "src/db/subjects/interfaces/subject.interfaces";
import { UserDomainInterface } from "src/db/user/interfaces/user.interfaces";

export interface SlotsInterface {
    id?: number;
    startTime: Date | string;
    endTime: Date | string;
    userId: number;
    subjectId: number;
    slotsTemplateId: number | null;
}

export interface CreateSingleSlotInterface {
    id?: number;
    startTime: string;
    endTime: string;
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
    user?: UserDomainInterface;
    subject?: SubjectDomainInterface;
}

