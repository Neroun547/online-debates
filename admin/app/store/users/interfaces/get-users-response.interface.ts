import type { UserStatus } from "~/store/auth/interfaces/auth-store.interface";

export interface UserItemInterface {
    id: number;
    username: string;
    email: string;
    status: UserStatus;
    timezone: string;
}

export interface GetUsersResponseInterface {
    data: UserItemInterface[];
    isLoadMorePossible: boolean;
}

