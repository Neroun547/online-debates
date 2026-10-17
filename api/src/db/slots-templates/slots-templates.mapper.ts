import type {
    SlotsTemplatesDomainInterface,
    SlotsTemplatesInterface,
} from "./interfaces/slots-templates.interface";
import { SlotsTemplates } from "./slots-templates.entity";

export class SlotsTemplatesMapper {
    static toDomain(params: SlotsTemplates): SlotsTemplatesDomainInterface {
        return {
            id: params.id,
            weekday: params.weekday,
            startTime: params.startTime,
            endTime: params.endTime,
            userId: params.userId,
            subjectId: params.subjectId,
            lastSlotCreation: params.lastSlotCreation,
        };
    }

    static toSave(data: SlotsTemplatesInterface): SlotsTemplates {
        const model = new SlotsTemplates();

        for (const key in data) {
            model[key] = data[key];
        }
        return model;
    }
}
