export interface GetMessagesResponseDto {
    messages: Array<{
        id: number;
        content: string;
        createdAt: string;
        isSender: boolean;
    }>;
    isLoadMoreAvailable: boolean;
}

