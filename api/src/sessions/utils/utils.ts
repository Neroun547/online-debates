import { DateTime } from "luxon";

export function parseMessageDateForRecipient(date: Date | string, userTimezone: string) {
    const parsedDate = typeof date === "object" ? DateTime.fromJSDate(date).toFormat("yyyy-MM-dd HH:mm") : date;

    return DateTime.fromFormat(parsedDate, "yyyy-MM-dd HH:mm", { zone: "UTC" }).setZone(userTimezone).toFormat("yyyy-MM-dd HH:mm");
}

export function parseMessageDateToSave(date: string, userTimezone: string) {
    return DateTime.fromFormat(date, "yyyy-MM-dd HH:mm", { zone: userTimezone }).toUTC().toFormat("yyyy-MM-dd HH:mm:ss");
}

export function generateCacheKeyForUserOnlineStatus(sessionId: number, userId: number): string {
    return "session:" + sessionId + ":user:" + userId;
}

