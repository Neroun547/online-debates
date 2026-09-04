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
    subjects?: SubjectDomainInterface[]; 
}

