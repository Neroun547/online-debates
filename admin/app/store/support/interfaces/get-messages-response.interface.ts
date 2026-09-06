export interface SupportItemInterface {
    id: number;
    email: string;
    subject: string;
    message: string;
    createdAt: Date | string;
}

export interface GetMessagesResponseInterface {
    count: number;
    data: Array<SupportItemInterface>;
}
