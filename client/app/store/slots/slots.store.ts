import { useApiFetch } from "~/libs/useApiFetch";
import type { BaseStoreInterface } from "../base-store.interface";
import type { CreateSlotsTemplatesRequestInterface } from "./interfaces/create-slots-templates-request.interface";
import type { SlotItem } from "~/pages/user/slots.vue";
import { Time } from "@internationalized/date";
import type { GetSlotsTemplatesResponseInterface } from "./interfaces/get-slots-templates-response.interface";
import type { CreateSingleSlotRequestInterface } from "./interfaces/create-single-slot-request.interface";
import type { GetSingleSlotsResponseDataItemInterface, GetSingleSlotsResponseInterface } from "./interfaces/get-single-slots-response.interface";
import type { GetSingleSlotsCountResponseInterface } from "./interfaces/get-single-slots-count-response.interface";

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
        async getSingleSlotsCount(params: {
            dateFrom: string;
            dateTo: string;
            subjectId: number,
        }): Promise<number | undefined> {    
            try {
                this.clearError();

                const data = await useApiFetch<GetSingleSlotsCountResponseInterface>(`/user/slots/single-slots/count?dateFrom=${params.dateFrom}&dateTo=${params.dateTo}&subjectId=${params.subjectId}`);
                
                return data?.count;
            } catch(error) {
                this.clearError();
            }
        },
        async deleteSingleSlot(id: number) {
            try {
                this.clearError();

                await useApiFetch(`/slots/single-slot/${id}`, { method: "DELETE" });
            } catch(error: any) {
                this.setError(error.response._data.message);
            }
        },
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

                const response = await useApiFetch<Array<GetSlotsTemplatesResponseInterface>>(`/user/slots/templates/?subjectId=${subjectId}`)

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
        async createSingleSlot(data: CreateSingleSlotRequestInterface) {
            try {
                this.clearError();

                await useApiFetch("/slots/single-slot", { method: "POST", body: data });
            } catch(error: any) {
                this.setError(error.response._data.message);
            }
        },
        async getSingleSlots(subjectId: number, dateFrom: string, dateTo: string, page: number, limit: number) {
            try {
                this.clearError();

                return await useApiFetch<GetSingleSlotsResponseInterface>(`/user/slots/single-slots?subjectId=${subjectId}&dateFrom=${dateFrom}&dateTo=${dateTo}&page=${page}&limit=${limit}`);
            } catch(error: any) {
                this.setError(error.response._data.message);
            }
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

