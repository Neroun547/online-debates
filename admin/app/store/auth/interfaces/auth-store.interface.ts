import type { BaseStoreInterface } from "../../interfaces/base-store.interface";

export enum UserStatus {
    ONLINE="online",
    BUSY="busy",
    OFFLINE="offline"
}

export interface AuthStoreInterface extends BaseStoreInterface {
    token: string;
    email: string;
    userId: number;
    isAuth: boolean;
}

