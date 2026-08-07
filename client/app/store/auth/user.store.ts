import { defineStore } from "pinia";
import { type UserStore } from "./interfaces/auth-store.interface";
import type { AuthRequestInterface } from "./interfaces/auth-request.interface";
import { useApiFetch } from "../../libs/useApiFetch";
import { getErrorMessage } from "~/utils/get-error-message";
import type { AuthResponseInterface } from "./interfaces/auth-response.interface";
import type { SignupRequestInterface } from "./interfaces/signup-request.interface";
import type { GetUserInfoResponseInterface } from "./interfaces/get-user-data-response.interface";
import type { UpdateUsernameResponseInterface } from "./interfaces/update-username-response.interface";
import type { UpdateEmailResponseInterface } from "./interfaces/update-email-response.interface";

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
        isOnline: false
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
        async confirmNewEmail(hash: string) {
            try {
                this.clearErrorState();

                const response = await useApiFetch<UpdateEmailResponseInterface>("/users/confirm-new-email/" + hash, { method: "GET" });

                if(response) {
                    this.setToken(response.token);
                }
            } catch(error: any) {
                this.setError(error.response._data.message);
            }
        },
        async updateEmail(email: string) {
            try {
                this.clearErrorState();
                
                const response = await useApiFetch<UpdateEmailResponseInterface>("/users/personal-data", { method: "PATCH", body: { email: email } });

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
        }
    },
    persist: {
        storage: piniaPluginPersistedstate.localStorage(),
        pick: [
            "token",
            "isAuth",
            "isOnline"
        ]
    },
});

