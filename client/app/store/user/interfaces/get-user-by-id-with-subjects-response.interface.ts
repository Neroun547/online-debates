import type { SubjectItem } from "~/store/categories/interfaces/get-subjects-response.interface";
import type { UserStatus } from "../user.store";

export interface GetUserByIdWithSubjectsResponseInterface {
	username: string;
	description: string | null;
	avatarFilename: string | null;
	age: number;
	subjects: SubjectItem[];
	email: string;
	isAvailableForPermanentSessions: boolean;
	timezone: string;
	status: UserStatus;
	sex: "male" | "female";
}
