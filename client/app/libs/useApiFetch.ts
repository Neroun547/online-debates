import { useUserStore } from "~/store/user/user.store"

type ApiFetchOptions = Parameters<typeof $fetch>[1]

export async function useApiFetch<T>(
	url: string,
	options: ApiFetchOptions = {}
) {
	const config = useRuntimeConfig()
	const userStore = useUserStore()
	const token = userStore.getToken

	const headers = new Headers(options?.headers)

	if (token) {
		headers.set("Authorization", `Bearer ${token}`)
	}
	try {
		const api = await $fetch<T>(url, {
			// @ts-ignore
			baseURL: config.public.apiBaseUrl,
			...options,
			headers
		})

		return api
	} catch (err: any) {
		if (err.statusCode === 401) {
			userStore.setIsAuth(false)

			window.location.href = "/auth"

			return
		}
		throw err
	}
}
