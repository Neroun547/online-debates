import { SessionsDomainInterface } from "src/db/sessions/interfaces/sessions.interfaces";
import { UserDomainInterface } from "src/db/user/interfaces/user.interfaces";

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
    user?: UserDomainInterface;
}

