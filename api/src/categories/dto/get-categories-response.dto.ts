import { CategoryDomainInterface } from "src/db/category/interfaces/category.interfaces";

export interface GetCategoriesResponseDto {
    data: Array<CategoryDomainInterface>;
    isLoadMoreAvailable: boolean; 
}

