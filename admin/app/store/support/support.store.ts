import { useApiFetch } from "~/libs/use-api-fetch";
import type { BaseStoreInterface } from "../interfaces/base-store.interface";
import type { GetMessagesRequestInterface } from "./interfaces/get-messages-request.interface";
import type { GetMessagesResponseInterface } from "./interfaces/get-messages-response.interface";

export const useSupportStore = defineStore("support", {
    state: (): BaseStoreInterface => ({
        isError: false,
        errorMessage: undefined
    }),
    actions: {
        async getMessages(params: GetMessagesRequestInterface): Promise<undefined | GetMessagesResponseInterface> {
            try {   
                this.clearError();

                return await useApiFetch<GetMessagesResponseInterface>(`/admin/support/?page=${params.page}&limit=${params.limit}`, { method: "GET" });
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

