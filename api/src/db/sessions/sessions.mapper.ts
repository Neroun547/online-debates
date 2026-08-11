import { SessionsDomainInterface } from "./interfaces/sessions.interfaces";
import { Sessions, SessionsStatus } from "./sessions.entity";

export class SessionsMapper {
    static toDomain(model: Sessions): SessionsDomainInterface {
        return {
            id: 0,
            slotId: 0,
            status: SessionsStatus.BOOKED,
            creatorId: 0,
            customerId: 0
        }
    }
}

