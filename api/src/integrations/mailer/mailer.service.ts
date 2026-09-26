import { Injectable } from "@nestjs/common";
import { Resend } from 'resend';
import * as dotenv from "dotenv";
import { ConfigService } from "@nestjs/config";

dotenv.config();

const resend = new Resend(process.env.MAILER_TOKEN);

@Injectable()
export class MailerService {
    constructor(private configService: ConfigService) {}

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

    getTemplateForSessionStartNotification(username: string, lang: "en" | "ru" | "uk", linkToSession: string) {
        const baseUrl = this.configService.getOrThrow("BASE_URL");

        if(lang === "uk") {
            return `
                <a href="${baseUrl}"><h2 style="color: #00a6f4; font-family: sans-serif; text-align: center;">wanna-talk.app</h2></a>
                <p>${username} щойно підключився до сессії. <a href="${linkToSession}">Підключитися</a></p> 
            `;
        } else if(lang === "ru") {
            return `
                <a href="${baseUrl}"><h2 style="color: #00a6f4; font-family: sans-serif; text-align: center;">wanna-talk.app</h2></a>
                <p>${username} только что подключился к сессии. <a href="${linkToSession}">Присоединиться</a></p> 
            `;
        } else {
            return `
                <a href="${baseUrl}"><h2 style="color: #00a6f4; font-family: sans-serif; text-align: center;">wanna-talk.app</h2></a>
                <p>${username} just joined the session. <a href="${linkToSession}">Connect</a></p> 
            `;
        }
    }

    addBaseTemplateToLetter(html: string) {
        const baseUrl = this.configService.getOrThrow("BASE_URL");

        return `
            <a href="${baseUrl}"><h2 style="color: #00a6f4; font-family: sans-serif; text-align: center;">wanna-talk.app</h2></a>
        ` + html;
    }

    getTemplateForBookedSession(datetime: string, username: string, lang: "en" | "ru" | "uk") {
        const baseUrl = this.configService.getOrThrow("BASE_URL");

        if(lang === "uk") {
            return `
                <a href="${baseUrl}"><h2 style="color: #00a6f4; font-family: sans-serif; text-align: center;">wanna-talk.app</h2></a>
                <p>Користувач ${username} забронював з вами сесію на ${datetime}</p>
                <a href="${baseUrl}/my-sessions">Перейти в список моїх сесій</a>
            `;
        } else if(lang === "ru") {
            return `
                <a href="${baseUrl}"><h2 style="color: #00a6f4; font-family: sans-serif; text-align: center;">wanna-talk.app</h2></a>
                <p>Пользователь ${username} забронировал с вами сессию на ${datetime}</p>
                <a href="${baseUrl}/my-sessions">Перейти в список моих сессий</a>
            `;
        } else {
            return `
                <a href="${baseUrl}"><h2 style="color: #00a6f4; font-family: sans-serif; text-align: center;">wanna-talk.app</h2></a>
                <p>User ${username} booked session with you at ${datetime}</p>
                <a href="${baseUrl}/my-sessions">Go to my sessions</a>
            `;
        }
    }

    getSubjectForBookedSessionMail(lang: "en" | "ru" | "uk") {
        if(lang === "uk") {
            return "Сесія заброньована з вами";
        } else if(lang === "ru") {
            return "Сессия забронирована с вами";
        } else {
            return "Session booked with you";
        }
    }

    getTemplateForBookedPermanentSession(username: string, lang: "en" | "ru" | "uk") {
        const baseUrl = this.configService.getOrThrow("BASE_URL");

        if(lang === "uk") {
            return `
                <a href="${baseUrl}"><h2 style="color: #00a6f4; font-family: sans-serif; text-align: center;">wanna-talk.app</h2></a>
                <p>Користувач ${username} забронював з вами постійну сесію</p>
                <a href="${baseUrl}/my-sessions">Перейти в список моїх сесій</a>
            `;
        } else if(lang === "ru") {
            return `
                <a href="${baseUrl}"><h2 style="color: #00a6f4; font-family: sans-serif; text-align: center;">wanna-talk.app</h2></a>
                <p>Пользователь ${username} забронировал с вами постоянную сессию</p>
                <a href="${baseUrl}/my-sessions">Перейти в список моих сессий</a>
            `;
        } else {
            return `
                <a href="${baseUrl}"><h2 style="color: #00a6f4; font-family: sans-serif; text-align: center;">wanna-talk.app</h2></a>
                <p>User ${username} booked permanent session with you</p>
                <a href="${baseUrl}/my-sessions">Go to my sessions</a>
            `;
        }
    }

    getUserStartedSessionLetterSubject(lang: "en" | "ru" | "uk") {
        if(lang === "uk") {
            return "Користувач підключився до сесії";
        } else if(lang === "ru") {
            return "Пользователь подключился к сессии";
        } else {
            return "User connected to session";
        }
    }
}

