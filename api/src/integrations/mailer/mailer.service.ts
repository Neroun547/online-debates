import { Injectable } from "@nestjs/common";
import { Resend } from 'resend';
import * as dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.MAILER_TOKEN);

@Injectable()
export class MailerService {
    constructor() {}

    async sendMailWithHtml(params: {
        from: string,
        to: string,
        subject: string,
        html: string
    }): Promise<void> {
        
        await resend.emails.send({
            from: params.from,
            to: params.to,
            subject: params.subject,
            html: params.html
        });
    }
}

