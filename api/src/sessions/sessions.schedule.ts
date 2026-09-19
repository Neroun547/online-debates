import { Injectable } from "@nestjs/common";
import { Interval } from "@nestjs/schedule";
import * as dotenv from "dotenv";
import { SessionsServiceDb } from "src/db/sessions/sessions.service";

dotenv.config();

@Injectable()
export class SessionsSchedule {
    constructor(private sessionsServiceDb: SessionsServiceDb) {}

    @Interval(Number(process.env.SESSIONS_SCHEDULE_CHANGE_STATUS_INTERVAL) ?? 60000)
    async changeSessionsStatus() {
        await this.sessionsServiceDb.updateSessionsExpiredStatus();

        return;
    }   
}

