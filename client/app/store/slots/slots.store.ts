import { useApiFetch } from "~/libs/useApiFetch";
import type { BaseStoreInterface } from "../base-store.interface";
import type { CreateSlotsTemplatesRequestInterface } from "./interfaces/create-slots-templates-request.interface";
import type { SlotItem } from "~/pages/user/slots.vue";
import { Time } from "@internationalized/date";

function getHoursAndMinutesFromStr(time: string) {
    const arr = time.split(":");

    return { hours: Number(arr[0]), minutes: Number(arr[1]) };
}

export const useSlotsStore = defineStore("slotsStore", {
    state: (): BaseStoreInterface => ({
        errorMessage: undefined,
        isError: false
    }),
    actions: {
        async saveSlotsTemplates(data: CreateSlotsTemplatesRequestInterface): Promise<void> {
            try {
                this.clearError();

                await useApiFetch(`/slots/templates`, { method: "PUT", body: data });
                
            } catch(error: any) {
                this.setError(error.response._data.message);
            }
        },
        async getTimeSlots(subjectId: number): Promise<SlotItem[]> {
            try {
                this.clearError();

                const response = await useApiFetch<Array<{ weekday: number, intervals: Array<{ startTime: string; endTime: string;  }> }>>(`/users/slots/templates/?subjectId=${subjectId}`)

                if(!response) return [];

                const result: SlotItem[] = [];
                let tmpIndex = 1;
                
                for(const templateSlot of response) {
                    result.push({
                        weekday: templateSlot.weekday,
                        intervals: templateSlot.intervals.map(item => { 
                            const parsedTimeFrom = getHoursAndMinutesFromStr(item.startTime);
                            const parsedTimeTo = getHoursAndMinutesFromStr(item.endTime);
                            
                            return {
                                timeFrom: new Time(parsedTimeFrom.hours, parsedTimeFrom.minutes, 0), 
                                timeTo: new Time(parsedTimeTo.hours, parsedTimeTo.minutes, 0), 
                                id: tmpIndex++ 
                            }
                        }),
                        enabled: true,
                        isError: false,
                        errorMessage: ""
                    });
                }
                return result;
            } catch(error: any) {
                this.setError(error.response._data.message);
            }
            return [];
        },
        clearError() {
            this.isError = false;
            this.errorMessage = undefined;
        },
        setError(error: any) {
            this.isError = true;
            this.errorMessage = getErrorMessage(error);
        }
    }
});

