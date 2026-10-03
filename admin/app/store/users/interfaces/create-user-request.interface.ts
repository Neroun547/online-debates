export interface CreateUserRequestInterface {
    username: string;
    email: string;
    timezone: string;
    password: string;
    age: number;
    description?: string;
    sex: "male" | "female";
}



