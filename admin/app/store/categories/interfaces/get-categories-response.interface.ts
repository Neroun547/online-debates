export interface SubjectItem {
    id: number;
    name: string;
    categoryId: number;
    userId: number;
}

export interface CategoryItem {
    id: number;
    name: string;
    priority: number;
    subjects?: SubjectItem[];
}

export interface GetCategoriesResponseInterface {
    data: Array<CategoryItem>;
    count: number;
}
