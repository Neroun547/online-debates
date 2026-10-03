import type { SubjectItem } from "./get-subjects-response.interface";

export interface CategoryItem {
    id: number;
    name: string;
    translateNameUk?: string;
    translateNameRu?: string;
    translateNameEn?: string;
    priority: number;
    subjects: SubjectItem[];
}

export interface GetCategoriesResponseInterface {
    data: Array<CategoryItem>;
    isLoadMoreAvailable: boolean; 
}
