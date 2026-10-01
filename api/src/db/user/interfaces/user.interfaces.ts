import { SubjectDomainInterface } from "src/db/subjects/interfaces/subject.interfaces";
import { UserSex, UserStatus } from "../user.entity";

// Interface for save
export interface UserInterface {
    id?: number;
    username: string;
    email: string;
    password: string;
    isConfirmed: boolean;
    status: UserStatus;
    timezone: string;
    language: string | null;
    avatarFilename: string | null;
    isAvailableForPermanentSessions: boolean;
    age: number; 
    sex: UserSex;
    description: string | null;
}

export interface UserWithSecureParams {
    id: number;
    username: string;
    email: string;
    password: string;
    isConfirmed: boolean;
    status: UserStatus;
    timezone: string;
    language: string | null;
    avatarFilename: string | null;
    isAvailableForPermanentSessions: boolean;
    age: number; 
    description: string | null;
    sex: UserSex;
    subjects?: SubjectDomainInterface[];
}

// Interface for update 
export interface UpdateUserInterface {
    id?: number;
    username?: string;
    email?: string;
    password?: string;
    isConfirmed?: boolean;
    status?: UserStatus;
    timezone?: string;
    language?: string | null;
    avatarFilename?: string | null;
    isAvailableForPermanentSessions?: boolean;
    age?: number;
    description?: string;
    sex?: UserSex;
}

// Domain user interface. Without password or other secure data
export interface UserDomainInterface {
    id: number;
    username: string;
    email: string;
    status: UserStatus;
    timezone: string;
    language: string | null;
    avatarFilename: string | null; 
    isAvailableForPermanentSessions: boolean;
    age: number;
    description: string | null;
    sex: UserSex;
    subjects?: SubjectDomainInterface[];
}

