import {
    SupportDomainInterface,
    SupportInterface,
} from "./interfaces/support.interfaces";
import { Support } from "./support.entity";

export class SupportMapper {
    static toSave(data: SupportInterface): Support {
        const model = new Support();

        model.email = data.email;
        model.subject = data.subject;
        model.message = data.message;
        model.createdAt = data.createAt;

        return model;
    }

    static toDomain(model: Support): SupportDomainInterface {
        return {
            id: model.id,
            email: model.email,
            subject: model.subject,
            message: model.message,
            createdAt: model.createdAt,
        };
    }
}
