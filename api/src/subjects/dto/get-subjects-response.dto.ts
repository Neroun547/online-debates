import { SubjectDomainInterface } from "src/db/subjects/interfaces/subject.interfaces";

export interface GetSubjectsResponseDto {
    data: SubjectDomainInterface[];
    count: number; 
}

