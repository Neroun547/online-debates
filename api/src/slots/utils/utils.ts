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

