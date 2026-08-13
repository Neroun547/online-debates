import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Sessions, SessionsStatus } from "./sessions.entity";
import { EntityManager, Repository } from "typeorm";
import { SessionsMapper } from "./sessions.mapper";

@Injectable()
export class SessionsServiceDb {
    constructor(
        @InjectRepository(Sessions) private sessionsRepository: Repository<Sessions>,
        private em: EntityManager
    ) {}

    async saveSession(params: {
        slotId: number;
        userId: number;
        slotAuthorId: number;
    }) {
        const sessionModel = SessionsMapper.toSave({
            slotId: params.slotId,
            status: SessionsStatus.BOOKED,
            creatorId: params.slotAuthorId,
            customerId: params.userId
        });
        await this.sessionsRepository.save(sessionModel);
    }
}

