import { CategoryDomainInterface } from "src/db/category/interfaces/category.interfaces";
import { UserDomainInterface } from "src/db/user/interfaces/user.interfaces";

export interface GetSubjectByIdWithCategoryAndUserResponseDto {
    id: number;
    categoryId: number;
    userId: number | null;
    name: string;
    user?: UserDomainInterface;
    category?: CategoryDomainInterface;
}
