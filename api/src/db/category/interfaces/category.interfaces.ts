import { SubjectDomainInterface } from "src/db/subjects/interfaces/subject.interfaces";

export interface CategoryInterface {
    id?: number;
    name: string;
    priority: number;
}

export interface CategoryDomainInterface {
    id: number;
    name: string;
    priority: number;
    translateNameRu?: string;
    translateNameUk?: string;
    translateNameEn?: string;
    subjects?: SubjectDomainInterface[]; 
}

