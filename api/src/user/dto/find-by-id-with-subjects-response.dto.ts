import { SubjectDomainInterface } from "src/db/subjects/interfaces/subject.interfaces";
import { UserSex, UserStatus } from "src/db/user/user.entity";

export interface FindByIdWithSubjectsResponseDto {
    username: string;
    description: string | null;
    avatarFilename: string | null; 
    age: number;
    email: string;
    isAvailableForPermanentSessions: boolean;
    timezone: string;
    status: UserStatus;
    sex: UserSex;
    subjects?: SubjectDomainInterface[];
}

