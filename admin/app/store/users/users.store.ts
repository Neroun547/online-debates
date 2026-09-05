import { useApiFetch } from "~/libs/use-api-fetch";
import type { BaseStoreInterface } from "../interfaces/base-store.interface";
import type { GetUsersResponseInterface } from "./interfaces/get-users-response.interface";
import type { CreateUserRequestInterface } from "./interfaces/create-user-request.interface";
import type { UpdateUserInterface } from "./interfaces/update-user-request.interface";

export const useUsersStore = defineStore("users", {
    state: (): BaseStoreInterface => ({
        isError: false,
        errorMessage: undefined
    }),
    actions: {
        async getUsers(params: {
            page: number;
            limit: number;
            searchUsername?: string;
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
        async updateUser(params: UpdateUserInterface) {
            try {
                this.clearError();

                await useApiFetch("/admin/users/" + params.id, { 
                    method: "PUT", 
                    body: {
                        username: params.username,
                        email: params.email,
                        timezone: params.timezone,
                        password: (params.password && params.password.length >= 8) ? params.password : undefined
                    } 
                })
            } catch(error: any) {
                this.setError(error.response._data.message);
            }
        },
        async deleteUserById(userId: number) {
            try {
                this.clearError();

                await useApiFetch("/admin/users/" + userId, { method: "DELETE" });
            } catch(error: any) {   
                this.setError(error.response._data.message);
            }
        },
        async createUser(data: CreateUserRequestInterface) {
            try {
                this.clearError();

                await useApiFetch("/admin/users/", { method: "POST", body: data });
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

