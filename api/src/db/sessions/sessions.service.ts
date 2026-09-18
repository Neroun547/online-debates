import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Sessions, SessionsStatus } from "./sessions.entity";
import { EntityManager, IsNull, Repository } from "typeorm";
import { SessionsMapper } from "./sessions.mapper";
import { Slots } from "../slots/slots.entity";
import { GetAllUserSessionsStatus } from "src/sessions/dto/get-all-user-sessions-request.dto";
import { SessionsDomainInterface } from "./interfaces/sessions.interfaces";
import { User, UserStatus } from "../user/user.entity";
import { Category } from "../category/category.entity";
import { Subject } from "../subjects/subject.entity";
import { DateTime } from "luxon";

@Injectable()
export class SessionsServiceDb {
    constructor(
        @InjectRepository(Sessions) private sessionsRepository: Repository<Sessions>,
        private em: EntityManager
    ) {}

    async findPermanentSession(params: { customerId: number; creatorId: number; subjectId: number; }): Promise<SessionsDomainInterface | null> {
        const data = await this.sessionsRepository.findOne({ where: { creatorId: params.creatorId,  customerId: params.customerId, subjectId: params.subjectId, slotId: IsNull() } });

        if(!data) {
            return null;
        }
        return SessionsMapper.toDomain(data);
    }
    async getBookedNowSessions(userId: number): Promise<SessionsDomainInterface[]> {
        const data = await this.sessionsRepository.find({ where: [ { creatorId: userId }, { customerId: userId } ], relations: { customer: true, creator: true } });

        return data.map(item => SessionsMapper.toDomain(item));
    }
    async savePermanentSession(
        params: {
            customerId: number;
            creatorId: number; 
            categoryId: number;
            subjectId: number;
        }
    ): Promise<number | undefined> {
        let savedId: number | undefined;

        await this.em.transaction("READ COMMITTED", async (tx) => {
            const creatorInDb = await tx.findOne(User, { where: { id: params.creatorId } });

            if(!creatorInDb) {
                throw new NotFoundException({ message: "User not found" });
            }
            if(!creatorInDb.isAvailableForPermanentSessions) {
                throw new BadRequestException({ message: "User not available" });
            }
            const customerInDb = await tx.findOne(User, { where: { id: params.customerId } });

            if(!customerInDb) {
                throw new NotFoundException({ message: "User not found" });
            }
            const categoryInDb = await tx.findOne(Category, { where: { id: params.categoryId } });

            if(!categoryInDb) {
                throw new NotFoundException({ message: "Category not found" });
            }
            const subjectInDb = await tx.findOne(Subject, { where: { id: params.subjectId } });

            if(!subjectInDb) {
                throw new NotFoundException({ message: "Subject not found" });
            }
            const permanentSessionInDb = await tx.findOne(Sessions, { where: { slotId: IsNull(), creatorId: params.creatorId, customerId: params.customerId, status: SessionsStatus.BOOKED } });

            if(permanentSessionInDb) {
                throw new ConflictException({ message: "Permanent session already booked" });
            }
            const sessionModel = SessionsMapper.toSave({
                slotId: null,
                status: SessionsStatus.BOOKED,
                creatorId: params.creatorId,
                customerId: params.customerId,
                createdAt: DateTime.fromJSDate(new Date()).toUTC().toFormat("yyyy-MM-dd HH:mm:ss"),
                subjectId: params.subjectId
            });
            const saved = await tx.save(sessionModel);

            savedId = saved.id;
        });
        return savedId;
    }
    async existsById(id: number): Promise<boolean> {
        return await this.sessionsRepository.exists({ where: { id: id } });
    }
    async isUserParticipant(sessionId: number, userId: number): Promise<boolean> {
        return await this.sessionsRepository.exists({
            where: [
                { id: sessionId, creatorId: userId },
                { id: sessionId, customerId: userId }
            ]
        });
    }

    async findByIdAndUserIdWithSenderAndRecipient(id: number, userId: number): Promise<null | SessionsDomainInterface> {
        const data = await this.sessionsRepository.findOne({ where: [{ id: id, creatorId: userId }, { id: id, customerId: userId }], relations: { creator: true, customer: true } });

        if(!data) {
            return null;
        }
        return SessionsMapper.toDomain(data);
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
                .where("(session.creatorId = :creatorId OR session.customerId = :customerId) AND (slot.startTime >= :startTime AND slot.endTime <= :endTime) OR (session.slotId IS NULL AND session.creatorId = :creatorId OR session.customerId = :customerId)", 
                { 
                    creatorId: params.userId, 
                    customerId: params.userId, 
                    startTime: params.dateFrom,
                    endTime: params.dateTo
                })
                .orderBy("slot.startTime", "DESC")
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
                .where("(session.creatorId = :creatorId) AND (slot.startTime >= :startTime AND slot.endTime <= :endTime) OR (session.slotId IS NULL AND session.creatorId = :creatorId)", 
                { 
                    creatorId: params.userId, 
                    startTime: params.dateFrom,
                    endTime: params.dateTo
                })
                .orderBy("slot.startTime", "DESC")
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
                .where("(session.customerId = :customerId) AND (slot.startTime >= :startTime AND slot.endTime <= :endTime) OR (session.slotId IS NULL AND session.customerId = :customerId)", 
                { 
                    customerId: params.userId, 
                    startTime: params.dateFrom,
                    endTime: params.dateTo
                })
                .orderBy("slot.startTime", "DESC")
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
        subjectId: number | null;
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
                customerId: params.userId,
                createdAt: DateTime.fromJSDate(new Date()).toUTC().toFormat("yyyy-MM-dd HH:mm:ss"),
                subjectId: params.subjectId
            });
            await tx.save(sessionModel);
        });
    }
}
