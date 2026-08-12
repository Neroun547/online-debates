import type { BaseStoreInterface } from "~/store/base-store.interface";

export interface UserStore extends BaseStoreInterface {
    isAuth: boolean;
    token: string;
    isOnline: boolean;
    userId: number | undefined;
}

