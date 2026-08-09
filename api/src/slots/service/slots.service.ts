import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CreateSlotsTemplateDto } from "../dto/create-slots-template.dto";
import { getSecondsFromTime } from "../utils/utils";
import { CategoryServiceDb } from "src/db/category/category.service";
import { SubjectServiceDb } from "src/db/subjects/subject.service";
import { SlotsTemplatesServiceDb } from "src/db/slots-templates/slots-templates.service";
import { SlotsTemplatesInterface } from "src/db/slots-templates/interfaces/slots-templates.interface";
import { SlotsServiceDb } from "src/db/slots/slots.service";

@Injectable()
export class SlotsService {
    constructor(
        private categoryServiceDb: CategoryServiceDb,
        private subjectServiceDb: SubjectServiceDb,
        private slotsTemplatesServiceDb: SlotsTemplatesServiceDb,
        private slotsServiceDb: SlotsServiceDb
    ) {

    }

    async getTemplatesByUserIdAndSubjectId(userId: number, subjectId: number) {
        return await this.slotsTemplatesServiceDb.findByUserIdAndSubjectId(userId, subjectId);
    }

    async saveTemplate(data: CreateSlotsTemplateDto, userId: number) {
        for(const slot of data.slots) {
            this.validateSlotTime(slot.startTime, slot.endTime);
        }
        const countCategoriesInDb = await this.categoryServiceDb.countById(data.categoryId);
        
        if(countCategoriesInDb <= 0) {
            throw new NotFoundException({ message: "Category not found" });
        }
        const countSubjectsInDb = await this.subjectServiceDb.countByCategoryIdAndId(data.categoryId, data.subjectId);

        if(countSubjectsInDb <= 0) {
            throw new NotFoundException({ message: "Subject not found" });
        }
        const templateSlotsArr: Array<SlotsTemplatesInterface> = [];

        for(const templateSlot of data.slots) {
            templateSlotsArr.push({
                weekday: templateSlot.weekday,
                startTime: templateSlot.startTime,
                endTime: templateSlot.endTime,
                userId: userId,
                subjectId: data.subjectId,
                lastSlotCreation: new Date()
            });
        }
        try {
            await this.slotsTemplatesServiceDb.saveWithSlots(
                templateSlotsArr,
                userId,
                data.subjectId
            );
        } catch(error) {
            console.log(error);
            throw new InternalServerErrorException({ message: "Save template transaction failed" });
        }
    }

    private validateSlotTime(startTime: string, endTime: string) {
        const startTimeSeconds = getSecondsFromTime(startTime);
        const endTimeSeconds = getSecondsFromTime(endTime);

        if((endTimeSeconds - startTimeSeconds) < 600) {
            throw new BadRequestException({ message: "Min interval 10 minutes" });
        }
        if(endTimeSeconds < startTimeSeconds) {
            throw new BadRequestException({ message: "End time must be greater than start time" });
        }
    }
}

