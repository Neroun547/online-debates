import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Sessions, SessionsStatus } from "./sessions.entity";
import { EntityManager, Repository } from "typeorm";
import { SessionsMapper } from "./sessions.mapper";
import { Slots } from "../slots/slots.entity";

@Injectable()
export class SessionsServiceDb {
    constructor(
        @InjectRepository(Sessions) private sessionsRepository: Repository<Sessions>,
        private em: EntityManager
    ) {}

    async deleteSessionsBeforeDate(sixthMonthBefore: string) {
        await this.sessionsRepository
            .createQueryBuilder()
            .delete()
            .from(Sessions)
            .where(`
                "slotId" IN (
                    SELECT id
                    FROM slots
                    WHERE "startTime" <= :date
                )
            `)
            .setParameter('date', sixthMonthBefore)
            .execute()
    }
    saveSession(params: {
        slotId: number;
        userId: number;
        slotAuthorId: number;
    }) {
        return this.em.transaction("READ COMMITTED", async (tx) => {
            const slotInDb = await tx
                .createQueryBuilder(Slots, "slot")
                .setLock("pessimistic_write")
                .where("slot.id = :slotId", { slotId: params.slotId })
                .getOne();

            if(!slotInDb) {
                throw new NotFoundException({ message: "Slot not found" });
            }
            const alreadyExistsSessionInDb = await tx
                .createQueryBuilder(Sessions, "session")
                .setLock("pessimistic_write")
                .where("session.slotId = :slotId", { slotId: params.slotId })
                .getOne();

            if(alreadyExistsSessionInDb) {
                throw new ConflictException({ message: "Session already exists" });
            }
            const sessionModel = SessionsMapper.toSave({
                slotId: params.slotId,
                status: SessionsStatus.BOOKED,
                creatorId: params.slotAuthorId,
                customerId: params.userId
            });
            await tx.save(sessionModel);
        });
    }
}

