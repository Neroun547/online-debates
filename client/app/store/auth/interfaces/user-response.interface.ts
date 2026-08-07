export enum UserStatus {
    ONLINE="online",
    BUSY="busy",
    OFFLINE="offline"
}

export interface UserInterface {
    id: number;
    username: string;
    email: string;
    isConfirmed: boolean;
    status: UserStatus;
}

