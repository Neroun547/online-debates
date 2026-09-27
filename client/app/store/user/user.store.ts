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
import type { UpdateUserAvatarResponseInterface } from "./interfaces/update-user-avatar.response";

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
        userId: undefined,
        language: null,
        avatarFilename: null
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
        async deleteAvatar() {
            try {
                await useApiFetch("/users/avatar", { method: "DELETE" });

                this.setAvatarFilename(null);
            } catch(error: any) {
                this.setError(error.response._data.message);
            }
        },
        async updateAvatar(file: File) {
            try {
                const formData = new FormData();

                formData.append("file", file);
                console.log(formData);

                const response = await useApiFetch<UpdateUserAvatarResponseInterface>("/users/avatar", { method: "PATCH", body: formData });

                if(response) {
                    this.avatarFilename = response.avatarFilename;
                    this.token = response.token;
                }
            } catch(error: any) {
                this.setError(error.response._data.message);
            }
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
        async sendPasswordRecoveryLink(email: string) {
            try {
                await useApiFetch("/users/send-password-recovery-link", { method: "POST", body: { email: email } });
            } catch(error: any) {
                console.log(error)
                this.setError(error.response._data.message);
            }
        },
        async passwordRecovery(newPassword: string, hash: string) {
            try {
                await useApiFetch("/users/password-recovery/" + hash, { method: "PATCH", body: { password: newPassword } });
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
        setIsOnline(value: boolean) {
            this.isOnline = value;
        },
        setLanguage(value: string | null) {
            this.language = value;
        },
        setAvatarFilename(value: string | null) {
            this.avatarFilename = value;
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
        async auth(data: AuthRequestInterface): Promise<{ language: string | null | undefined } | undefined> {
            try {
                this.clearErrorState();

                const response = await useApiFetch<AuthResponseInterface>("/users/auth", { method: "POST", body: data });

                if(response) {
                    this.setUserId(response.userId);
                    this.setToken(response.token);
                    this.setIsAuth(true);
                    this.setIsOnline(response.isOnline);
                    this.setLanguage(response.language);
                    this.setAvatarFilename(response.avatarFilename);
                }
                return { language: response?.language }
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
        async updateUserLanguage(language: string) {
            try {
                this.setLanguage(language);

                await useApiFetch("/users/language", { method: "PATCH", body: { language: language } });
            } catch(error: any) {
                this.setError(error);
            }
        }
    },
    persist: {
        storage: piniaPluginPersistedstate.localStorage(),
        pick: [
            "userId",
            "token",
            "isAuth",
            "isOnline",
            "language",
            "avatarFilename"
        ]
    },
});

