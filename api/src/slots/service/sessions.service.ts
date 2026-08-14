import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { DateTime } from "luxon";
import { SessionsServiceDb } from "src/db/sessions/sessions.service";
import { SlotsServiceDb } from "src/db/slots/slots.service";
import { UserServiceDb } from "src/db/user/user.service";

@Injectable()
export class SessionsService {
    constructor(
        private sessionsServiceDb: SessionsServiceDb,
        private slotsServiceDb: SlotsServiceDb,
        private usersServiceDb: UserServiceDb
    ) {

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

