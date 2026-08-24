import { SessionsMapper } from "../sessions/sessions.mapper";
import { UserMapper } from "../user/user.mapper";
import { MessagesDomainInterface, MessagesInterface } from "./interfaces/messages.interfaces";
import { Messages } from "./messages.entity";

export class MessagesMapper {
    static toDomain(model: Messages): MessagesDomainInterface {
        return {
            id: model.id,
            content: model.content,
            createdAt: new Date(model.createdAt),
            senderId: model.senderId,
            sessionId: model.sessionId,
            session: model.session ? SessionsMapper.toDomain(model.session) : undefined,
            user: model.user ? UserMapper.toDomain(model.user) : undefined
        }
    }

    static toSave(data: MessagesInterface): Messages {
        const model = new Messages();

        model.content = data.content;
        model.createdAt = data.createdAt;
        model.senderId = data.senderId;
        model.sessionId = data.sessionId;
        
        return model;
    }   
}

