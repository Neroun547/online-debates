import { defineStore } from "pinia";
import type { AuthStoreInterface } from "./interfaces/auth-store.interface";
import type { AuthRequestInterface } from "./interfaces/auth-request.interface";
import { useApiFetch } from "../../libs/use-api-fetch";
import type { AuthResponseInterface } from "./interfaces/auth-response.interface";
import { getErrorMessage } from "~/utils/get-error-message";

export const useAuthStore = defineStore("auth", {
    state: (): AuthStoreInterface => ({
        token: "",
        username: "",
        userId: 0,
        isError: false,
        errorMessage: "",
        isAuth: false
    }),
    actions: {
        async auth(data: AuthRequestInterface) {
            try {
                this.clearErrorState();

                const response = await useApiFetch<AuthResponseInterface>("/admin/auth", { method: "POST", body: { email: data.email, password: data.password } });

                if(response) {
                    this.setIsAuth(true);
                    this.setToken(response.token);
                
                    this.username = response.username;
                    this.userId = response.id;
                }
            } catch(error: any) {
                this.setError(error.response._data.message);
            }
        },
        async checkAuth() {
            try {
                this.clearErrorState();

                await useApiFetch("/admin/auth", { method: "GET" });
            } catch(error: any) {
                this.setError(error.response._data.message);
            }
        },
        setIsAuth(value: boolean) {
            this.isAuth = value;
        },
        setToken(value: string) {
            this.token = value;
        },
        setError(error: any) {
            this.isError = true;
            this.errorMessage = getErrorMessage(error);
        },
        clearErrorState() {
            this.isError = false;
            this.errorMessage = "";
        }
    },
    getters: {
        getToken: (state) => state.token
    },
    persist: {
        storage: piniaPluginPersistedstate.localStorage(),
        pick: ["token", "username", "userId", "isAuth"],
    },
});

