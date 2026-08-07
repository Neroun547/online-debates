import { SubjectDomainInterface } from "src/db/subjects/interfaces/subject.interfaces";

export interface GetByCategoryIdWithCategoryAndUserResponseDto {
    data: Array<SubjectDomainInterface>;
    isLoadMoreAvailable: boolean;
}

