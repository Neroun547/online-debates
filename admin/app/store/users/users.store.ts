import { useApiFetch } from "~/libs/use-api-fetch";
import type { BaseStoreInterface } from "../interfaces/base-store.interface";
import type { GetUsersResponseInterface } from "./interfaces/get-users-response.interface";

export const useUsersStore = defineStore("users", {
    state: (): BaseStoreInterface => ({
        isError: false,
        errorMessage: undefined
    }),
    actions: {
        async getUsers(params: {
            page: number;
            limit: number;
            searchUsername: string;
        }): Promise<GetUsersResponseInterface | undefined> {
            try {
                this.clearError();

                let query = `?page=${params.page}&limit=${params.limit}`;

                if(params.searchUsername) {
                    query += "&searchUsername=" + params.searchUsername;
                }
                return await useApiFetch<GetUsersResponseInterface>("/admin/users" + query, { method: "GET" });
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

