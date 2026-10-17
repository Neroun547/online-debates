import { SessionsDomainInterface } from "src/db/sessions/interfaces/sessions.interfaces";
import { UserDomainInterface } from "src/db/user/interfaces/user.interfaces";

export interface MessagesInterface {
    id?: number;
    content: string;
    createdAt: Date | string;
    senderId: number;
    sessionId: number;
}

export interface MessagesDomainInterface {
    id: number;
    content: string;
    createdAt: Date;
    senderId: number;
    sessionId: number;
    session: SessionsDomainInterface | undefined;
    user: UserDomainInterface | undefined;
}
