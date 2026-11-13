export interface AuthResponseInterface {
	token: string;
	userId: number;
	isOnline: boolean;
	language: string | null;
	avatarFilename: string | null;
}
