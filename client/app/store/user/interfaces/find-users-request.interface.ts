export interface FindUsersRequestInterface {
	emailOrUsername?: string
	ageFrom: number
	ageTo: number
	sex: "male" | "female" | "all"
	page: number
	limit: number
}
