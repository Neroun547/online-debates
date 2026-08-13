import { SessionsDomainInterface, SessionsInterface } from "./interfaces/sessions.interfaces";
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

    static toSave(data: SessionsInterface): Sessions {
        const model = new Sessions();

        for(let key in data) {
            model[key] = data[key];
        }
        return model;
    }
}

