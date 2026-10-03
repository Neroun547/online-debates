export interface UpdateUserInterface {
    id: number;
    username: string;
    email: string;
    password?: string;
    timezone: string;
    age: number;
    description: string;
    sex: "male" | "female";
}
