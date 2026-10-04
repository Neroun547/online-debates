import { DateTime } from "luxon";

export function getDateFromAndDateToForGetBookingAvailableSlots(year: number, month: number) {
    const dateFrom = year + "-" + month + "-" + "01 00:00:00";
    const dateTo = DateTime.fromJSDate(new Date(year, month, 0)).toFormat("yyyy-MM-dd") + " " + "23:59:59";

    return {
        dateFrom,
        dateTo
    }
}

