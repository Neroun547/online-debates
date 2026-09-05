import { CategoryDomainInterface } from "src/db/category/interfaces/category.interfaces";
import { UserDomainInterface } from "src/db/user/interfaces/user.interfaces";

export interface SubjectInterface {
    id?: number;
    name: string;
    categoryId: number;
    userId: number | null;
}

export interface SubjectDomainInterface {
    id: number;
    name: string;
    categoryId: number;
    userId: number | null;
    category?: CategoryDomainInterface;
    user?: UserDomainInterface;
}

