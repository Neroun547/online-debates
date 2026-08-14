import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { GetAllUserSessionsStatus } from "../dto/get-all-user-sessions-request.dto";
import { DateTime } from "luxon";
import { SessionsServiceDb } from "src/db/sessions/sessions.service";
import { SlotsServiceDb } from "src/db/slots/slots.service";
import { UserServiceDb } from "src/db/user/user.service";
import { SessionsDomainInterface } from "src/db/sessions/interfaces/sessions.interfaces";
import { parseStartTimeAndEndTimeForCustomer } from "src/slots/utils/utils";

@Injectable()
export class SessionsService {
    constructor(
        private sessionsServiceDb: SessionsServiceDb,
        private slotsServiceDb: SlotsServiceDb,
        private usersServiceDb: UserServiceDb
    ) {

    }

    async getAllUsersSessions(params: {
            dateFrom: string;
            dateTo: string;
            page: number;
            limit: number;
            status: GetAllUserSessionsStatus;
            userId: number;
    }) {
        const userInDb = await this.usersServiceDb.findById(params.userId);

        if(!userInDb) {
            throw new NotFoundException({ message: "User not found" });
        }
        const data = await this.sessionsServiceDb.getSessionsByDateRangeAndUserId({
            dateFrom: params.dateFrom,
            dateTo: params.dateTo,
            limit: params.limit,
            page: params.page,
            status: params.status,
            userId: params.userId
        });

        return data.map(item => {
            if(item.slot && item.customer && item.creator) {
                const parseTimes = parseStartTimeAndEndTimeForCustomer(item.slot.startTime, item.slot.endTime, userInDb.timezone);
                
                return {
                    ...item,
                    slot: {
                        ...item.slot,
                        startTime: parseTimes.startTime,
                        endTime: parseTimes.endTime
                    }
                }
            }   
            return item;
        });
    }

    async bookSession(slotId: number, userId: number, currentUserDateTime: string) {
        const slotInDb = await this.slotsServiceDb.findByIdWithUser(slotId);
    
        if(!slotInDb || !slotInDb.user) {
            throw new NotFoundException({ message: "Slot not found" });
        }
        const userInDb = await this.usersServiceDb.findById(userId);
    
        if(!userInDb) {
            throw new NotFoundException({ message: "User not found" });
        }
        const currentUserDateTimeMillis = DateTime.fromFormat(
            currentUserDateTime, 
            "yyyy-MM-dd HH:mm", 
            { zone: userInDb.timezone }
        ).toMillis();
        const slotDateTimeMillis = DateTime.fromJSDate(slotInDb.startTime, { zone: slotInDb.user.timezone }).toMillis();
    
        if(currentUserDateTimeMillis > slotDateTimeMillis) {
            throw new BadRequestException({ message: "User current date greater than slot start time" });
        }
        await this.sessionsServiceDb.saveSession({
            slotId: slotId,
            userId: userId,
            slotAuthorId: slotInDb.userId
        });    
    }
}

