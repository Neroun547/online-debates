import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SlotsTemplates } from "./slots-templates.entity";
import { EntityManager, IsNull, Not, Repository } from "typeorm";
import { SlotsTemplatesInterface } from "./interfaces/slots-templates.interface";
import { SlotsTemplatesMapper } from "./slots-templates.mapper";
import { Slots } from "../slots/slots.entity";
import { DateTime } from "luxon";
import { SlotsMapper } from "../slots/slots.mapper";
import { Sessions } from "../sessions/sessions.entity";
import { SlotsServiceDb } from "../slots/slots.service";
import { getDateForSlot, getDateStringForSaveSlot } from "src/slots/utils/utils";
import { SlotsLock } from "../slots-lock/slots-lock.entity";
import { SlotsLockMapper } from "../slots-lock/slots-lock.mapper";
import { User } from "../user/user.entity";

@Injectable()
export class SlotsTemplatesServiceDb {
    constructor(
        @InjectRepository(SlotsTemplates) private repository: Repository<SlotsTemplates>,
        private em: EntityManager,

        private slotsServiceDb: SlotsServiceDb
    ) {

    }

    async save(data: SlotsTemplatesInterface) {
        const model = SlotsTemplatesMapper.toSave(data);

        await this.repository.save(model);
    }
    async saveWithSlots(templateSlots: Array<SlotsTemplatesInterface>, userId: number, subjectId: number): Promise<void> {
        const slotsLockInDb = await this.em.findOne(SlotsLock, { where: { userId: userId, subjectId: subjectId } });
        
        if(!slotsLockInDb) {
            const slotsLockModel = SlotsLockMapper.toSave({
                userId: userId,
                subjectId: subjectId
            });
            await this.em
                .createQueryBuilder()
                .insert()
                .into(SlotsLock)
                .values({ ...slotsLockModel })
                .orIgnore()
                .execute();
        }
        const templatesSlotsModelsArr = templateSlots.map(item => SlotsTemplatesMapper.toSave(item));

        return this.em.transaction("READ COMMITTED", async (tx) => {
            await tx.createQueryBuilder(SlotsLock, "slotsLock")
                    .setLock("pessimistic_write")
                    .where("slotsLock.userId = :userId AND slotsLock.subjectId = :subjectId", { userId: userId, subjectId: subjectId })
                    .getOneOrFail();

            const now = new Date();
            const currentDatePlusThreeMonthMillis = DateTime.fromJSDate(now).plus({ months: 3 }).toMillis();
            // Delete prev slots and templates if exists ...
            const slotsInDb = await tx.find(Slots, { where: { userId: userId, subjectId: subjectId, slotsTemplateId: Not(IsNull()) } });
            const promisesDeleteSlots: Array<Promise<any>> = [];
            const templatesId: Array<number> = [];

            if(slotsInDb) {
                for(const slot of slotsInDb) {
                    const sessionInDb = await tx.findOne(Sessions, { where: { slotId: slot.id } });

                    if(!sessionInDb) {
                        promisesDeleteSlots.push(tx.delete(Slots, { id: slot.id }));
                    } 
                    if(slot.slotsTemplateId !== null && slot.slotsTemplateId !== undefined) {
                        templatesId.push(slot.slotsTemplateId);
                    }
                }
                await Promise.all(promisesDeleteSlots);
                await Promise.all(templatesId.map(id => tx.delete(SlotsTemplates, { id: id })));
            }
            // Re-run slots template delete
            await tx.delete(SlotsTemplates, { userId: userId, subjectId: subjectId });


            let nowDateTmp = now;
            let nowDateMillisTmp = DateTime.fromJSDate(nowDateTmp).toMillis();

            const userInDb = await tx.findOne(User, { where: { id: userId } });

            while(nowDateMillisTmp < currentDatePlusThreeMonthMillis) {
                for(const templateSlot of templatesSlotsModelsArr) {
                    const savedTemplate = await tx.save(templateSlot);
                
                    const dateForTemplateSlot = getDateForSlot(templateSlot.weekday, nowDateTmp.getDay(), nowDateTmp);
                    
                    if(!dateForTemplateSlot || !userInDb) {
                        continue;
                    }
                    const countConflictSlotByDateRange = await this.slotsServiceDb.countConflictSlotByDateRange(
                        getDateStringForSaveSlot(dateForTemplateSlot, templateSlot.startTime, userInDb.timezone), 
                        getDateStringForSaveSlot(dateForTemplateSlot, templateSlot.endTime, userInDb.timezone),
                        userId,
                        subjectId,
                        tx
                    );

                    if(countConflictSlotByDateRange > 0 || !dateForTemplateSlot || !userInDb) {
                        continue;
                    }
                    const slot = SlotsMapper.toSave({
                        startTime: getDateStringForSaveSlot(dateForTemplateSlot, templateSlot.startTime, userInDb.timezone),
                        endTime: getDateStringForSaveSlot(dateForTemplateSlot, templateSlot.endTime, userInDb.timezone),
                        userId: savedTemplate.userId,
                        subjectId: savedTemplate.subjectId,
                        slotsTemplateId: savedTemplate.id
                    });
                    await tx.save(slot);
                }
                const dateNowPlusWeek = DateTime.fromJSDate(nowDateTmp).plus({ weeks: 1 });

                nowDateTmp = dateNowPlusWeek.toJSDate();
                nowDateMillisTmp = dateNowPlusWeek.toMillis();
            }
        });
    }
    async findByUserIdAndSubjectId(userId: number, subjectId: number): Promise<Array<{ weekday: number, intervals: Array<{ startTime: string; endTime: string;  }> }>> {
        const data = await this.repository
            .createQueryBuilder("slotsTemplates")
            .where({ userId: userId, subjectId: subjectId })
            .getMany();
        
        const weekdayArr: Array<{ weekday: number, intervals: Array<{ startTime: string; endTime: string;  }> }> = [];

        for(const templateSlot of data) {
            const alreadyInArr = weekdayArr.find(item => item.weekday === templateSlot.weekday);

            if(alreadyInArr) {
                alreadyInArr.intervals.push({
                    startTime: templateSlot.startTime,
                    endTime: templateSlot.endTime
                });
            } else {
                weekdayArr.push({
                    weekday: templateSlot.weekday,
                    intervals: [{ startTime: templateSlot.startTime, endTime: templateSlot.endTime }]
                });
            }
        }
        return weekdayArr;
    }
}


