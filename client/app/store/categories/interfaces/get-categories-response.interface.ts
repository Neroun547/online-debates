export interface CategoryItem {
    id: number;
    name: string;
    translateNameUk?: string;
    translateNameRu?: string;
    translateNameEn?: string;
    priority: number;
}

export interface GetCategoriesResponseInterface {
    data: Array<CategoryItem>;
    isLoadMoreAvailable: boolean; 
}
