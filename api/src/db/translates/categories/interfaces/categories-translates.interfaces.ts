import { CategoriesTranslatesPropertyNames } from "../categories-translates.entity";

export interface CategoriesTranslatesSaveInterface {
    property: CategoriesTranslatesPropertyNames;
    value: string;
    categoryId: number;
    language: string;
}

export interface CategoriesTranslatesDomainInterface {
    id: number;
    property: CategoriesTranslatesPropertyNames;
    value: string;
    categoryId: number;
    language: string;
}

