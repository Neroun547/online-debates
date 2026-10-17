import { CategoryDomainInterface } from "src/db/category/interfaces/category.interfaces";

export interface GetCategoriesForAdminResponseDto {
    data: Array<CategoryDomainInterface>;
    count: number;
}
