export interface AdminInterface {
    id?: number;
    email: string;
    password: string;
}

export interface AdminDomainInterface {
    id: number;
    email: string;
}

export interface AdminDomainInterfaceWithSecureParams {
    id: number;
    email: string;
    password: string;
}

export interface UpdateAdminInterface {
    id?: number;
    email?: string;
    password?: string;
}
