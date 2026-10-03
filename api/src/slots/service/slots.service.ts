import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CreateSlotsTemplateDto } from "../dto/create-slots-template.dto";
import { getSecondsFromTime, parseStartTimeAndEndTimeForCustomer } from "../utils/utils";
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

    async getSlotsForBooking(params: {
        dateFrom: string;
        dateTo: string;
        subjectId: number;
        authorId: number;
        customerId: number;
    }) {
        if(params.authorId === params.customerId) {
            throw new BadRequestException({ message: "Customer id and author id cannot be the same" });    
        }
        const customerInDb = await this.usersServiceDb.findById(params.customerId);

        if(!customerInDb) {
            throw new NotFoundException({ message: "User not found" });
        }
        const authorInDb = await this.usersServiceDb.findById(params.authorId);
   
        if(!authorInDb) {
            throw new NotFoundException({ message: "User not found" });
        }
        const data = await this.slotsServiceDb.findForBooking({
            dateFrom: params.dateFrom,
            dateTo: params.dateTo,
            userId: params.authorId,
            subjectId: params.subjectId
        });
        return data.map(item => {
            const parsedDate = parseStartTimeAndEndTimeForCustomer(item.startTime, item.endTime, customerInDb.timezone);

            return {
                ...item,
                startTime: parsedDate.startTime,
                endTime: parsedDate.endTime
            }
        });
    }

    async getTotalSingleSlots(userId: number, dateFrom: string, dateTo: string, subjectId: number): Promise<number> {
        return await this.slotsServiceDb.getTotalSingleSlots({
            userId: userId,
            dateFrom: dateFrom,
            dateTo: dateTo,
            subjectId: subjectId
        });
    }
    async deleteSingleSlot(slotId: number, userId: number) {
        const userInDb = await this.usersServiceDb.findById(userId);

        if(!userInDb) {
            throw new NotFoundException({ message: "User not found" });
        }
        const slotInDb = await this.slotsServiceDb.findSingleSlotByUserIdAndSlotIdWithSession(userId, slotId);

        if(!slotInDb) {
            throw new NotFoundException({ message: "Slot not found" });
        }
        if(slotInDb.session) {
            throw new BadRequestException({ message: "Cannot delete slot with booked session" });
        }
        await this.slotsServiceDb.deleteSlotByUserIdAndId(userId, slotId);
    }

    async saveSingleSlot(body: CreateSingleSlotDto, userId: number) {
        const subjectInDb = await this.subjectServiceDb.findById(body.subjectId);

        if(!subjectInDb) {
            throw new NotFoundException({ message: "Subject not found" });
        }
        this.validateSingleSlotTime(new Date(body.startTime), new Date(body.endTime));

        await this.slotsServiceDb.saveSingleSlot({
            startTime: body.startTime,
            endTime: body.endTime,
            userId: userId,
            subjectId: body.subjectId,
            slotsTemplateId: null
        });
    }
    async getTemplatesByUserIdAndSubjectId(userId: number, subjectId: number) {
        const userInDb = await this.usersServiceDb.findById(userId);

        if(!userInDb) {
            throw new NotFoundException({ message: "User not found" });
        }
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
        const count = await this.slotsServiceDb.getTotalSingleSlots({
            userId: params.userId,
            dateFrom: params.dateFrom,
            dateTo: params.dateTo,
            subjectId: params.subjectId
        });
        const slots = await this.slotsServiceDb.findSingleSlots({
            userId: params.userId,
            dateFrom: params.dateFrom,
            dateTo: params.dateTo,
            subjectId: params.subjectId,
            page: params.page,
            limit: params.limit
        });
        const data = slots.map(slot => {
            const startAndEndTime = parseStartTimeAndEndTimeForCustomer(slot.startTime, slot.endTime, userInDb.timezone);

            return {
                ...slot,
                startTime: startAndEndTime.startTime,
                endTime: startAndEndTime.endTime
            }
        });
        return {
            data: data,
            isLoadMoreAvailable: count > (params.page * params.limit)
        }
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

