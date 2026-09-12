import { SlotsMapper } from "../slots/slots.mapper";
import { UserMapper } from "../user/user.mapper";
import { SessionsDomainInterface, SessionsInterface } from "./interfaces/sessions.interfaces";
import { Sessions, SessionsStatus } from "./sessions.entity";

export class SessionsMapper {
    static toDomain(model: Sessions): SessionsDomainInterface {
        return {
            id: model.id,
            slotId: model.slotId,
            status: SessionsStatus.BOOKED,
            creatorId: model.creatorId,
            customerId: model.customerId,
            createdAt: model.createdAt,
            slot: model.slot ? SlotsMapper.toDomain(model.slot) : undefined,
            creator: model.creator ? UserMapper.toDomain(model.creator) : undefined,
            customer: model.customer ? UserMapper.toDomain(model.customer) : undefined
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

