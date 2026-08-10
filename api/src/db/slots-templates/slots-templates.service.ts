import { ConflictException, Injectable } from "@nestjs/common";
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
    saveWithSlots(templateSlots: Array<SlotsTemplatesInterface>, userId: number, subjectId: number): Promise<void> {
        const templatesSlotsModelsArr = templateSlots.map(item => SlotsTemplatesMapper.toSave(item));

        return this.em.transaction("READ COMMITTED", async (tx) => {
            const now = new Date();
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

            for(const templateSlot of templatesSlotsModelsArr) {
                const savedTemplate = await tx.save(templateSlot);
                
                const dateForTemplateSlot = this.getDateForSlot(templateSlot.weekday, now.getDay(), now);
                const countConflictSlotByDateRange = await this.slotsServiceDb.countConflictSlotByDateRange(
                    dateForTemplateSlot + " " + templateSlot.startTime, 
                    dateForTemplateSlot + " " + templateSlot.endTime, 
                tx);
          
                if(countConflictSlotByDateRange > 0) {
                    continue;
                }
                const slot = SlotsMapper.toSave({
                    startTime: DateTime.fromFormat(dateForTemplateSlot + " " + templateSlot.startTime, "yyyy-MM-dd HH:mm").toJSDate(),
                    endTime: DateTime.fromFormat(dateForTemplateSlot + " " + templateSlot.endTime, "yyyy-MM-dd HH:mm").toJSDate(),
                    userId: savedTemplate.userId,
                    subjectId: savedTemplate.subjectId,
                    slotsTemplateId: savedTemplate.id
                });
                await tx.save(slot);
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

    private getDateForSlot(weekday: number, currentDayOfTheWeek: number, now: Date): string | undefined {
        if(weekday > currentDayOfTheWeek) {
            return DateTime.fromJSDate(now).plus({ days: weekday - currentDayOfTheWeek }).toFormat("yyyy-MM-dd");
        }
        if(currentDayOfTheWeek === weekday) {
            return DateTime.fromJSDate(now).toFormat("yyyy-MM-dd");
        }
        if(weekday < currentDayOfTheWeek) {
            return DateTime.fromJSDate(now).plus({ weeks: 1 }).minus({ days: currentDayOfTheWeek - weekday }).toFormat("yyyy-MM-dd");
        }
    }
}


