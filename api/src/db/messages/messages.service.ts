import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Messages } from "./messages.entity";
import { Repository } from "typeorm";
import {
    MessagesDomainInterface,
    MessagesInterface,
} from "./interfaces/messages.interfaces";
import { MessagesMapper } from "./messages.mapper";

@Injectable()
export class MessagesServiceDb {
    constructor(
        @InjectRepository(Messages) private repository: Repository<Messages>,
    ) {}

    async saveAndReturn(
        data: MessagesInterface,
    ): Promise<MessagesDomainInterface> {
        const savedModel = await this.repository.save(
            MessagesMapper.toSave(data),
        );

        return MessagesMapper.toDomain(savedModel);
    }
    async findBySessionId(
        sessionId: number,
        skip: number,
        limit: number,
    ): Promise<MessagesDomainInterface[]> {
        const data = await this.repository.find({
            where: { sessionId: sessionId },
            take: limit,
            skip: skip,
            order: { id: "DESC" },
        });

        return data.map((item) => MessagesMapper.toDomain(item));
    }
    async countBySessionId(sessionId: number): Promise<number> {
        return await this.repository.count({ where: { sessionId: sessionId } });
    }
}
