import { UserStatus } from "../user.entity";

// Interface for save
export interface UserInterface {
    id?: number;
    username: string;
    email: string;
    password: string;
    isConfirmed: boolean;
    status: UserStatus;
    timezone: string;
    isAvailableForInstantMeeting: boolean;
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
    isAvailableForInstantMeeting?: boolean;
}

// Domain user interface. Without password or other secure data
export interface UserDomainInterface {
    id: number;
    username: string;
    email: string;
    status: UserStatus;
    timezone: string;
    isAvailableForInstantMeeting: boolean;
}

