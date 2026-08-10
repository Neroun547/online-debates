import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CreateSlotsTemplateDto } from "../dto/create-slots-template.dto";
import { getSecondsFromTime } from "../utils/utils";
import { CategoryServiceDb } from "src/db/category/category.service";
import { SubjectServiceDb } from "src/db/subjects/subject.service";
import { SlotsTemplatesServiceDb } from "src/db/slots-templates/slots-templates.service";
import { SlotsTemplatesInterface } from "src/db/slots-templates/interfaces/slots-templates.interface";
import { SlotsServiceDb } from "src/db/slots/slots.service";
import { CreateSingleSlotDto } from "../dto/create-single-slot.dto";
import { DateTime } from "luxon";
import { UserServiceDb } from "src/db/user/user.service";

@Injectable()
export class SlotsService {
    constructor(
        private categoryServiceDb: CategoryServiceDb,
        private subjectServiceDb: SubjectServiceDb,
        private slotsTemplatesServiceDb: SlotsTemplatesServiceDb,
        private slotsServiceDb: SlotsServiceDb,
        private usersServiceDb: UserServiceDb
    ) {

    }

    async saveSingleSlot(body: CreateSingleSlotDto, userId: number) {
        const subjectInDb = await this.subjectServiceDb.findById(body.subjectId);

        if(!subjectInDb) {
            throw new NotFoundException({ message: "Subject not found" });
        }
        this.validateSingleSlotTime(new Date(body.startTime), new Date(body.endTime));

        const countConflictSlots = await this.slotsServiceDb.countConflictSlotByDateRange(body.startTime, body.endTime, userId);

        if(countConflictSlots > 0) {
            throw new ConflictException({ message: "The selected time period overlaps with another slot" });
        }
        await this.slotsServiceDb.save({
            startTime: new Date(body.startTime),
            endTime: new Date(body.endTime),
            userId: userId,
            subjectId: body.subjectId,
            slotsTemplateId: null
        });
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
        } catch(error: any) {
            throw new InternalServerErrorException({ message: "Save template transaction failed" });
        }
    }

    async getSingleSlots(params: {
        userId: number;
        dateFrom: string;
        dateTo: string;
        subjectId: number;
        page: number;
        limit: number;
    }) {
        const subjectInDb = await this.subjectServiceDb.findById(params.subjectId);

        if(!subjectInDb) {
            throw new NotFoundException({ message: "Subject not found" });
        }
        const userInDb = await this.usersServiceDb.findById(params.userId);

        if(!userInDb) {
            throw new NotFoundException({ message: "User not found" });
        }
        const slots = await this.slotsServiceDb.findSingleSlots({
            userId: params.userId,
            dateFrom: params.dateFrom,
            dateTo: params.dateTo,
            subjectId: params.subjectId,
            page: params.page,
            limit: params.limit
        });
        return slots.map(slot => {
            const startTime = DateTime.fromJSDate(new Date(slot.startTime)).setZone(userInDb.timezone).toFormat("yyyy-MM-dd HH:mm");
            const endTime = DateTime.fromJSDate(new Date(slot.endTime)).setZone(userInDb.timezone).toFormat("yyyy-MM-dd HH:mm");

            return {
                ...slot,
                startTime: startTime,
                endTime: endTime
            }
        });
    }

    private validateSlotTime(startTime: string, endTime: string): void {
        const startTimeSeconds = getSecondsFromTime(startTime);
        const endTimeSeconds = getSecondsFromTime(endTime);

        if((endTimeSeconds - startTimeSeconds) < 600) {
            throw new BadRequestException({ message: "Min interval 10 minutes" });
        }
        if(endTimeSeconds < startTimeSeconds) {
            throw new BadRequestException({ message: "End time must be greater than start time" });
        }
    }

    private validateSingleSlotTime(dateFrom: Date, dateTo: Date): void {
        const dateFromLuxon = DateTime.fromJSDate(dateFrom);
        const dateToLuxon = DateTime.fromJSDate(dateTo);

        const dateFromMillis = dateFromLuxon.toMillis();
        const dateToMillis = dateToLuxon.toMillis();

        if(dateFromMillis >= dateToMillis) {
            throw new BadRequestException({ message: "Date from must be greater than date to" });
        }
        if((dateToMillis - dateFromMillis) <= 600000) {
            throw new BadRequestException({ message: "Min interval 10 minutes" });
        }
    }
}

