import { SlotsLock } from "./slots-lock.entity";

export class SlotsLockMapper {
    static toSave(params: { userId: number; subjectId: number }): SlotsLock {
        const model = new SlotsLock();

        model.userId = params.userId;
        model.subjectId = params.subjectId;

        return model;
    }
}

