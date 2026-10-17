import { SubjectDomainInterface } from "src/db/subjects/interfaces/subject.interfaces";

export interface CategoryInterface {
    id?: number;
    name: string;
    priority: number;
    emoji: string | null;
}

export interface CategoryDomainInterface {
    id: number;
    name: string;
    priority: number;
    emoji: string | null;
    translateNameRu?: string;
    translateNameUk?: string;
    translateNameEn?: string;
    subjects?: SubjectDomainInterface[];
}
