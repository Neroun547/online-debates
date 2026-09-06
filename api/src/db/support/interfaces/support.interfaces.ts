export interface SupportInterface {
    id?: number;
    email: string;
    subject: string;
    message: string;
    createAt: Date | string;
}

export interface SupportDomainInterface {
    id: number;
    email: string;
    subject: string;
    message: string;
    createdAt: Date | string;
}
