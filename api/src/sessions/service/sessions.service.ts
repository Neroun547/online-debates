import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { GetAllUserSessionsStatus } from "../dto/get-all-user-sessions-request.dto";
import { DateTime } from "luxon";
import { SessionsServiceDb } from "src/db/sessions/sessions.service";
import { SlotsServiceDb } from "src/db/slots/slots.service";
import { UserServiceDb } from "src/db/user/user.service";
import { SessionsDomainInterface } from "src/db/sessions/interfaces/sessions.interfaces";
import { parseStartTimeAndEndTimeForCustomer } from "src/slots/utils/utils";
import { MessagesServiceDb } from "src/db/messages/messages.service";
import type { GetMessagesResponseDto } from "../dto/get-messages-response.dto";
import { parseMessageDateForRecipient, parseMessageDateToSave } from "../utils/utils";
import { MessagesDomainInterface } from "src/db/messages/interfaces/messages.interfaces";

@Injectable()
export class SessionsService {
    constructor(
        private sessionsServiceDb: SessionsServiceDb,
        private slotsServiceDb: SlotsServiceDb,
        private usersServiceDb: UserServiceDb,
        private messagesServiceDb: MessagesServiceDb
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

    async saveMessageAndReturn(params: {
        content: string;
        senderId: number;
        sessionId: number;
        date: string;
    }): Promise<MessagesDomainInterface> {
        const userInDb = await this.usersServiceDb.findById(params.senderId);
   
        if(!userInDb) {
            throw new NotFoundException({ message: "User not found" });
        }
        return await this.messagesServiceDb.saveAndReturn({
            content: params.content,
            createdAt: parseMessageDateToSave(params.date, userInDb.timezone),
            senderId: params.senderId, 
            sessionId: params.sessionId
        });
    }

    async getMessages(params: {
        skip: number;
        limit: number;
        sessionId: number;
        userId: number;
    }): Promise<GetMessagesResponseDto> {
        const sessionInDb = await this.sessionsServiceDb.findByIdAndUserIdWithSenderAndRecipient(params.sessionId, params.userId);

        if(!sessionInDb) {
            throw new NotFoundException({ message: "User session not found" });
        }
        const messages = await this.messagesServiceDb.findBySessionId(params.sessionId, params.skip, params.limit);

        const currentUser = params.userId === sessionInDb.creatorId ? sessionInDb.creator : sessionInDb.customer; 
        const secondUser = params.userId !== sessionInDb.creatorId ? sessionInDb.creator : sessionInDb.customer;

        if(!currentUser || !secondUser) {
            throw new NotFoundException({ message: "Users not found" });
        }
        const countAllSessionMessages = await this.messagesServiceDb.countBySessionId(params.sessionId);

        return {
            messages: messages.map(item => ({
                id: item.id,
                content: item.content,
                createdAt: parseMessageDateForRecipient(item.createdAt, currentUser.timezone),
                isSender: item.senderId === params.userId
            })).sort((a, b) => a.id - b.id),
            isLoadMoreAvailable: countAllSessionMessages > (params.skip + params.limit)
        }
    }
}
