import type { UserInterface } from "~/store/user/interfaces/user-response.interface";
import type { CategoryItem } from "./get-categories-response.interface";

export interface GetSubjectByIdResponseInterface {
	id: number;
	name: string;
	categoryId: number;
	userId: number;
	user?: UserInterface;
	category?: CategoryItem;
}
