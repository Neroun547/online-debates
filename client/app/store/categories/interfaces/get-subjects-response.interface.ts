import type { UserStatus } from "~/store/user/user.store"
import type { CategoryItem } from "./get-categories-response.interface"

export interface SubjectItem {
	id: number
	name: string
	categoryId: number
	userId: number
	category?: CategoryItem
	user?: UserStatus
}

export interface GetSubjectsResponseInterface {
	data: Array<SubjectItem>
	isLoadMoreAvailable: boolean
}
