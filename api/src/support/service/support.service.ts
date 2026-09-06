import { Injectable } from "@nestjs/common";
import { SupportServiceDb } from "src/db/support/support.service";
import { DateTime } from "luxon";
import { SupportDomainInterface } from "src/db/support/interfaces/support.interfaces";
import { GetSupportItemsResponseInterface } from "../dto/get-support-items-response.interface";

@Injectable()
export class SupportService {
    constructor(private supportServiceDb: SupportServiceDb) {

    }   

    async save(params: {
        email: string;
        subject: string;
        message: string;
    }): Promise<void> {
        await this.supportServiceDb.save({
            email: params.email,
            subject: params.subject,
            message: params.message,
            createAt: DateTime.fromJSDate(new Date()).toUTC().toFormat("yyyy-MM-dd HH:mm:ss")
        });
    }

    async getSupportItems(params: {
        page: number;
        limit: number;
    }): Promise<GetSupportItemsResponseInterface> {
        const items = await this.supportServiceDb.find(params.page, params.limit); 
        const count = await this.supportServiceDb.countAll();

        return {
            count: count,
            data: items
        }
    }
}

