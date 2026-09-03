export interface CategoryItem {
    id: number;
    name: string;
    priority: number;
}

export interface GetCategoriesResponseInterface {
    data: Array<CategoryItem>;
    count: number;
}
