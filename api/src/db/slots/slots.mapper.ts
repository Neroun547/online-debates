import { SlotsInterface, type SlotDomainInterface } from "./interfaces/slots.interfaces";
import { Slots } from "./slots.entity";

export class SlotsMapper {
    static toDomain(model: Slots): SlotDomainInterface {
        return {
            id: model.id,
            startTime: model.startTime,
            endTime: model.endTime,
            userId: model.userId,
            subjectId: model.subjectId,
            slotsTemplateId: model.slotsTemplateId
        }
    }
    static toSave(data: SlotsInterface): Slots {
        const model = new Slots();

        model.startTime = data.startTime;
        model.endTime = data.endTime;
        model.userId = data.userId;
        model.subjectId = data.subjectId;
        model.slotsTemplateId = data.slotsTemplateId;
        
        return model;
    }
}

