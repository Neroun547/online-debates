import { DateTime } from "luxon";

export function getSecondsFromTime(time: string): number {
    const arr = time.split(":");

    return (Number(arr[0]) * 60 * 60) + Number(arr[1]) * 60;
}

export function getDateForSlot(weekday: number, currentDayOfTheWeek: number, now: Date): string | undefined {
    if(weekday > currentDayOfTheWeek) {
        return DateTime.fromJSDate(now).plus({ days: weekday - currentDayOfTheWeek }).toFormat("yyyy-MM-dd");
    }
    if(currentDayOfTheWeek === weekday) {
        return DateTime.fromJSDate(now).toFormat("yyyy-MM-dd");
    }
    if(weekday < currentDayOfTheWeek) {
        return DateTime.fromJSDate(now).plus({ weeks: 1 }).minus({ days: currentDayOfTheWeek - weekday }).toFormat("yyyy-MM-dd");
    }
}

export function parseStartTimeAndEndTimeForCustomer(startTime: Date, endTime: Date, customerTimezone: string): {
    startTime: string;
    endTime: string;
} {
    const parsedStartTime = DateTime.fromJSDate(startTime).toFormat("yyyy-MM-dd HH:mm");
    const parsedEndTime = DateTime.fromJSDate(endTime).toFormat("yyyy-MM-dd HH:mm");
    
    return {
        startTime: DateTime.fromFormat(parsedStartTime, "yyyy-MM-dd HH:mm", { zone: "UTC" }).setZone(customerTimezone).toFormat("yyyy-MM-dd HH:mm"),
        endTime: DateTime.fromFormat(parsedEndTime, "yyyy-MM-dd HH:mm", { zone: "UTC" }).setZone(customerTimezone).toFormat("yyyy-MM-dd HH:mm"),
    }
}

export function parseDateForCustomer(time: Date, timezone: string): string {
    const parsed = DateTime.fromJSDate(time).toFormat("yyyy-MM-dd");

    return DateTime.fromFormat(parsed, "yyyy-MM-dd", { zone: "UTC" }).setZone(timezone).toFormat("yyyy-MM-dd");
}

export function getDateStringForSaveSlot(dateForSlot: string, time: string, timezone: string) {
    return DateTime.fromFormat(dateForSlot + " " + time, "yyyy-MM-dd HH:mm", { zone: timezone }).toUTC().toFormat("yyyy-MM-dd HH:mm:ss");
}
