export interface AuthResponseDto {
    token: string;
    userId: number;
    isOnline: boolean;
    language: string | null;
    avatarFilename: string | null;
}

