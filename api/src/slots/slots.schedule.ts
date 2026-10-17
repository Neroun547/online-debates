import { Injectable } from "@nestjs/common";
import { Interval } from "@nestjs/schedule";
import { DateTime } from "luxon";
import { SessionsServiceDb } from "src/db/sessions/sessions.service";
import { SlotsServiceDb } from "src/db/slots/slots.service";

const SCHEDULE_DELETE_SLOTS_AND_SESSIONS_AND_GENERATE_NEW_SLOTS_INTERVAL: number = 86400000; // 24 hours

@Injectable()
export class SlotsSchedule {
    constructor(
        private slotsServiceDb: SlotsServiceDb,
        private sessionsServiceDb: SessionsServiceDb,
    ) {}
    /*
        Delete slots every 24 hours
    */
    @Interval(
        SCHEDULE_DELETE_SLOTS_AND_SESSIONS_AND_GENERATE_NEW_SLOTS_INTERVAL,
    )
    async slotsSchedule() {
        const now = new Date();
        // Delete old sessions and slots
        const sixthMonthBefore = DateTime.fromJSDate(now)
            .minus({ months: 6 })
            .toFormat("yyyy-MM-dd HH:mm:ss");

        await Promise.all([
            this.sessionsServiceDb.deleteSessionsBeforeDate(sixthMonthBefore),
            this.slotsServiceDb.deleteSlotsBeforeDate(sixthMonthBefore),
        ]);
    }
    /*
        Generate slots for next 3 month every 24 hours
    */
    @Interval(
        SCHEDULE_DELETE_SLOTS_AND_SESSIONS_AND_GENERATE_NEW_SLOTS_INTERVAL,
    )
    generateSlots() {
        const now = new Date();
        const threeMonthAfter = DateTime.fromJSDate(now)
            .plus({ months: 3 })
            .toFormat("yyyy-MM-dd");
        // Generate new slots
        this.slotsServiceDb.generateNewSlots(threeMonthAfter).catch((error) => {
            console.log("Schedule generate slots error:", error);
        });
    }
}
