export interface GetUsersBySubjectResponseInterface {
	id: number
	email: string
	username: string
	status: string
	timezone: string
	isAvailableForPermanentSessions: boolean
	avatarFilename: string | null
	sex: "male" | "female"
}
