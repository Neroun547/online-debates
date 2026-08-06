import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

@Injectable()
export class MailerService {
    constructor(private configService: ConfigService) {}

    private getTransport(): nodemailer.Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options> {
        const transporter = nodemailer.createTransport({
            host: this.configService.getOrThrow("MAILER_HOST"),
            port: Number(this.configService.getOrThrow("MAILER_PORT"))
        }); 

        return transporter;
    }

    async sendMailWithHtml(params: {
        from: string,
        to: string,
        subject: string,
        html: string
    }): Promise<void> {
        const transporter = this.getTransport();
        
        await transporter.sendMail({
            from: params.from,
            to: params.to,
            subject: params.subject,
            html: params.html
        });
    }
}

