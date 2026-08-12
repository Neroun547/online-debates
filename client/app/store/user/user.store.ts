import { defineStore } from "pinia";
import { type UserStore } from "./interfaces/auth-store.interface";
import type { AuthRequestInterface } from "./interfaces/auth-request.interface";
import { useApiFetch } from "../../libs/useApiFetch";
import { getErrorMessage } from "~/utils/get-error-message";
import type { AuthResponseInterface } from "./interfaces/auth-response.interface";
import type { SignupRequestInterface } from "./interfaces/signup-request.interface";
import type { GetUserInfoResponseInterface } from "./interfaces/get-user-data-response.interface";
import type { UpdateUsernameResponseInterface } from "./interfaces/update-username-response.interface";
import type { UpdateUserDataResponseInterface } from "./interfaces/update-user-data-response.interface";
import type { UpdatePersonalInfoRequestInterface } from "./interfaces/update-personal-info-request.interface";
import type { GetUsersBySubjectResponseInterface } from "./interfaces/get-users-by-subject-response.interface";

export enum UserStatus {
    ONLINE="online",
    BUSY="busy",
    OFFLINE="offline"
}

export const useUserStore = defineStore("user", {
    state: (): UserStore => ({
        isError: false,
        errorMessage: undefined,
        isAuth: false,
        token: "",
        isOnline: false,
        userId: undefined
    }),
    getters: {
        getToken: (state: UserStore): string | null => {
           return state.token;
        },
        getIsAuth: (state: UserStore): boolean | null => {
           return state.isAuth;
        }
    },
    actions: {
        logout() {
            this.isAuth = false;
            this.token = "";

            window.location.href = "/auth";
        },
        async updatePassword(oldPassword: string, newPassword: string, confirmNewPassword: string) {
            try {
                this.clearErrorState();
                await useApiFetch("/users/password", { method: "PATCH", body: { oldPassword: oldPassword, newPassword: newPassword, confirmNewPassword: confirmNewPassword } })
            } catch(error: any) {
                this.setError(error.response._data.message);
            }
        },
        async confirmNewEmail(hash: string) {
            try {
                this.clearErrorState();

                const response = await useApiFetch<UpdateUserDataResponseInterface>("/users/confirm-new-email/" + hash, { method: "GET" });

                if(response) {
                    this.setToken(response.token);
                }
            } catch(error: any) {
                this.setError(error.response._data.message);
            }
        },
        async updateUserPersonalInfo(data: UpdatePersonalInfoRequestInterface): Promise<{ isMailSent: boolean }> {
            try {
                this.clearErrorState();

                const response = await useApiFetch<UpdateUserDataResponseInterface>("/users/personal-data", { method: "PATCH", body: data });

                if(response) {
                    this.setToken(response.token);
                }
                return { isMailSent: response && response.isMailSent ? response.isMailSent : false }
            } catch(error: any) {
                this.setError(error.response._data.message);
            }
            return { isMailSent: false };
        },
        async updateEmail(email: string) {
            try {
                this.clearErrorState();
                
                const response = await useApiFetch<UpdateUserDataResponseInterface>("/users/personal-data", { method: "PATCH", body: { email: email } });

                if(response) {
                    this.setToken(response.token);
                }
            } catch(error: any) {
                this.setError(error.response._data.message);
            }
        },
        async updateUsername(username: string) {
            try {
                this.clearErrorState();
                
                const response = await useApiFetch<UpdateUsernameResponseInterface>("/users/personal-data", { method: "PATCH", body: { username: username } });
                  
                if(response) {
                    this.setToken(response.token);
                }
            } catch(error: any) {
                this.setError(error.response._data.message);
            }
        },
        async updateIsOnlineState(value: boolean) {
            this.isOnline = value;

            try {
                await useApiFetch("/users/status", { method: "PATCH", body: { 
                        status: value ? "online" : "offline"
                    }
                });
            } catch(error: any) {
                this.setError(error.response._data.message);
            }
        },
        setError(value: any) {
            this.isError = true;
            this.errorMessage = getErrorMessage(value);
        },
        clearErrorState() {
            this.isError = false;
            this.errorMessage = undefined;
        },
        setToken(token: string) {
           this.token = token;
        },
        setIsAuth(value: boolean) {
          this.isAuth = value;
        },
        setUserId(value: number) {
            this.userId = value;
        },
        async getUserInfo(): Promise<GetUserInfoResponseInterface | undefined> {
            try {
                this.clearErrorState();

                return await useApiFetch<GetUserInfoResponseInterface>("/users/", { method: "GET" });
            } catch(error: any) {
                this.setError(error.response._data.message);
            }
        },
        async confirmAccount(hash: string) {
            try {
                this.clearErrorState();

                await useApiFetch("/users/signup/confirm/" + hash, { method: "GET" });
            } catch(error: any) {
                this.setError(error.response._data.message);
            }
        },
        async auth(data: AuthRequestInterface): Promise<void> {
            try {
                this.clearErrorState();

                const response = await useApiFetch<AuthResponseInterface>("/users/auth", { method: "POST", body: data });

                if(response) {
                    this.setUserId(response.userId);
                    this.setToken(response.token);
                    this.setIsAuth(true);
                }
            } catch(error: any) {
                this.setError(error.response._data.message);
            }
        },
        async signup(data: SignupRequestInterface) {
            try {
                this.clearErrorState();

                await useApiFetch("/users/signup", { method: "POST", body: data });
            } catch(error: any) {
                this.setError(error.response._data.message);
            }
        },
        async deleteAccount() {
            try {
                this.clearErrorState();

                await useApiFetch("/users/", { method: "DELETE" });

                this.setToken("");
                this.setIsAuth(false);

                window.location.href = "/auth";
            } catch(error: any) {
                this.setError(error.response._data.message);
            }
        },
        async getUsersSubjectId(params: {
            subjectId: number;
            page: number;
            limit: number;
        }): Promise<GetUsersBySubjectResponseInterface[] | undefined> {
            try {
                return await useApiFetch<GetUsersBySubjectResponseInterface[]>(`/subjects/${params.subjectId}/users?limit=${params.limit}&page=${params.page}&subjectId=${params.subjectId}`);
            } catch(error: any) {
                this.setError(error);
            }
        },
    },
    persist: {
        storage: piniaPluginPersistedstate.localStorage(),
        pick: [
            "userId",
            "token",
            "isAuth",
            "isOnline"
        ]
    },
});

