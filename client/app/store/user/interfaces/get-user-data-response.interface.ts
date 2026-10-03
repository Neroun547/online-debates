export interface GetUserInfoResponseInterface {
    username: string;
    email: string;
    timezone: string;
    isAvailableForPermanentSessions: boolean;
    age: number;
    sex: "male" | "female";
    description?: string;
}

