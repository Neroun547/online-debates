export interface GetChatMessagesResponseInterface {
    messages: Array<{
        id: number;
        content: string;
        createdAt: string;
        isSender: boolean;
    }>;
    isLoadMoreAvailable: boolean;
}

