import type { UserStatus } from "~/store/auth/interfaces/auth-store.interface";

export interface SubjectItem {
    id: number;
    name: string;
    categoryId: number;
    userId: number | null;
    category: {
        id: number;
        name: string;
        priority: number;
    };
    user?: {
        id: number;
        username: string;
        email: string;
        status: UserStatus;
        timezone: string;
    };
}

export interface GetSubjectsResponseInterface {
    data: SubjectItem[];
    count: number;
}

