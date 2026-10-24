import { useApiFetch } from "~/libs/useApiFetch"
import type { BaseStoreInterface } from "../base-store.interface"
import type { sendMessageToSupportRequestInterface } from "./interfaces/send-message-to-support-request.interface"

export const useSupportStore = defineStore("support", {
	state: (): BaseStoreInterface => ({
		errorMessage: undefined,
		isError: false
	}),
	actions: {
		async sendMessageToSupport(data: sendMessageToSupportRequestInterface) {
			try {
				this.clearError()

				await useApiFetch("/support", { method: "POST", body: data })
			} catch (error: any) {
				this.setError(error.response._data.message)
			}
		},
		clearError() {
			this.isError = false
			this.errorMessage = undefined
		},
		setError(error: any) {
			this.isError = true
			this.errorMessage = getErrorMessage(error)
		}
	}
})
