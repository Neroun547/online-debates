import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Sessions, SessionsStatus } from "./sessions.entity";
import { EntityManager, Repository } from "typeorm";
import { SessionsMapper } from "./sessions.mapper";
import { Slots } from "../slots/slots.entity";
import { GetAllUserSessionsStatus } from "src/sessions/dto/get-all-user-sessions-request.dto";

@Injectable()
export class SessionsServiceDb {
    constructor(
        @InjectRepository(Sessions) private sessionsRepository: Repository<Sessions>,
        private em: EntityManager
    ) {}

    async isUserParticipant(sessionId: number, userId: number): Promise<boolean> {
        return await this.sessionsRepository.exists({
            where: [
                { id: sessionId, creatorId: userId },
                { id: sessionId, customerId: userId }
            ]
        });
    }

    async getSessionsByDateRangeAndUserId(params: {
        dateFrom: string; 
        dateTo: string;
        userId: number;
        page: number; 
        limit: number; 
        status: GetAllUserSessionsStatus;
    }) {
        let data: Array<Sessions> = [];
        
        if(params.status === GetAllUserSessionsStatus.ALL) {
            data = await this.sessionsRepository
                .createQueryBuilder("session")
                .leftJoinAndSelect("session.slot", "slot")
                .leftJoinAndSelect("session.customer", "customer")
                .leftJoinAndSelect("session.creator", "creator")
                .leftJoinAndSelect("slot.subject", "subject")
                .leftJoinAndSelect("subject.category", "category")
                .where("(session.creatorId = :creatorId OR session.customerId = :customerId) AND (slot.startTime >= :startTime AND slot.endTime <= :endTime)", 
                { 
                    creatorId: params.userId, 
                    customerId: params.userId, 
                    startTime: params.dateFrom,
                    endTime: params.dateTo
                })
                .offset((params.page - 1) * params.limit)
                .limit(params.limit)
                .getMany();
        }
        if(params.status === GetAllUserSessionsStatus.BOOKED_WITH_ME) {
            data = await this.sessionsRepository
                .createQueryBuilder("session")
                .leftJoinAndSelect("session.slot", "slot")
                .leftJoinAndSelect("session.customer", "customer")
                .leftJoinAndSelect("session.creator", "creator")
                .leftJoinAndSelect("slot.subject", "subject")
                .leftJoinAndSelect("subject.category", "category")
                .where("(session.creatorId = :creatorId) AND (slot.startTime >= :startTime AND slot.endTime <= :endTime)", 
                { 
                    creatorId: params.userId, 
                    startTime: params.dateFrom,
                    endTime: params.dateTo
                })
                .offset((params.page - 1) * params.limit)
                .limit(params.limit)
                .getMany();
        }
        if(params.status === GetAllUserSessionsStatus.MY_BOOKING) {
            data = await this.sessionsRepository
                .createQueryBuilder("session")
                .leftJoinAndSelect("session.slot", "slot")
                .leftJoinAndSelect("session.customer", "customer")
                .leftJoinAndSelect("session.creator", "creator")
                .leftJoinAndSelect("slot.subject", "subject")
                .leftJoinAndSelect("subject.category", "category")
                .where("(session.customerId = :customerId) AND (slot.startTime >= :startTime AND slot.endTime <= :endTime)", 
                { 
                    customerId: params.userId, 
                    startTime: params.dateFrom,
                    endTime: params.dateTo
                })
                .offset((params.page - 1) * params.limit)
                .limit(params.limit)
                .getMany();
        }
        return data.map(session => SessionsMapper.toDomain(session));
    }
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
