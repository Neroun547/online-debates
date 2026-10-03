import type { CategoryItem } from "~/store/categories/interfaces/get-categories-response.interface";

export interface GetUserPersonalInfoResponseDto {
    username: string;
    email: string;
    aboutMe: string;
    avatarFilename: string;
    categories: CategoryItem[];
}
