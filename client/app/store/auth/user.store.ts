import { defineStore } from "pinia";
import { type UserStore } from "./interfaces/auth-store.interface";
import type { AuthRequestInterface } from "./interfaces/auth-request.interface";
import { useApiFetch } from "../../libs/useApiFetch";
import { getErrorMessage } from "~/utils/get-error-message";
import type { AuthResponseInterface } from "./interfaces/auth-response.interface";
import { useLocalStorage } from "@vueuse/core";
import type { SignupRequestInterface } from "./interfaces/signup-request.interface";

export const useUserStore = defineStore("user", {
    state: (): UserStore => ({
        isError: false,
        errorMessage: undefined,
        token: useLocalStorage("token", undefined)
    }),
    actions: {
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

                this.setToken(response.token);
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
        }
    }
});

