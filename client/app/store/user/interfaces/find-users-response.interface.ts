import type { UserInterface } from "./user-response.interface";

export interface FindUsersResponseInterface {
	data: UserInterface[];
	isLoadMoreAvailable: boolean;
}
