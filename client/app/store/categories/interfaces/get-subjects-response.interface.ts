import type { UserStatus } from "~/store/user/user.store";
import type { GetCategoriesResponseInterface } from "./get-categories-response.interface";

export interface SubjectItem {
    id: number;
    name: string;
    categoryId: number;
    userId: number;
    category?: GetCategoriesResponseInterface;
    user?: UserStatus;
}

export interface GetSubjectsResponseInterface {
    data: Array<SubjectItem>;
    isLoadMoreAvailable: boolean;
}