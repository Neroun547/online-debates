import { UserDomainInterface } from "src/db/user/interfaces/user.interfaces";
import { SessionsStatus } from "../sessions.entity";
import { SlotDomainInterface } from "src/db/slots/interfaces/slots.interfaces";

export interface SessionsInterface {
    id?: number;
    slotId: number;
    status: SessionsStatus;
    creatorId: number;
    customerId: number; 
}

export interface SessionsDomainInterface {
    id: number;
    slotId: number;
    status: SessionsStatus;
    creatorId: number;
    customerId: number;
    creator?: UserDomainInterface;
    customer?: UserDomainInterface; 
    slot?: SlotDomainInterface;
}

