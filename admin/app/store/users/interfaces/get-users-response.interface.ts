import type { UserStatus } from "~/store/auth/interfaces/auth-store.interface";

export interface UserItemInterface {
    id: number;
    username: string;
    email: string;
    status: UserStatus;
    timezone: string;
    age: number;
    description: string | null;
    sex: "male" | "female";
}

export interface GetUsersResponseInterface {
    data: UserItemInterface[];
    isLoadMorePossible: boolean;
    count: number;
}
