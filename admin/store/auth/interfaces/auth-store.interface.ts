import type { BaseStoreInterface } from "../../interfaces/base-store.interface";

export interface AuthStoreInterface extends BaseStoreInterface {
    token: string;
    username: string;
    userId: number;
    isAuth: boolean;
}

