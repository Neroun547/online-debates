import { UserDomainInterface } from "src/db/user/interfaces/user.interfaces";
import { SessionsStatus } from "../sessions.entity";
import { SlotDomainInterface } from "src/db/slots/interfaces/slots.interfaces";

export interface SessionsInterface {
    id?: number;
    slotId: number | null;
    status: SessionsStatus;
    creatorId: number;
    customerId: number;
    createdAt: Date | string;
    subjectId: number | null;
}

export interface SessionsDomainInterface {
    id: number;
    slotId: number | null;
    status: SessionsStatus;
    creatorId: number;
    customerId: number;
    createdAt: Date | string;
    subjectId: number | null;
    creator?: UserDomainInterface;
    customer?: UserDomainInterface;
    slot?: SlotDomainInterface;
}
