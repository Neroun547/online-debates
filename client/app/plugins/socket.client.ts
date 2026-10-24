import { useUserStore } from "~/store/user/user.store"
import type { BaseSocket } from "~/types/base-socket.interface"

interface SocketPluginResult {
	provide: {
		sessionsSocket: BaseSocket
		userStateSocket: BaseSocket
	}
}

export default defineNuxtPlugin((nuxtApp): SocketPluginResult => {
	const userStore = useUserStore()

	const createSocket = nuxtApp.$nuxtSocket as unknown as (
		this: typeof nuxtApp,
		options: Record<string, unknown>
	) => BaseSocket
	const sessionSocket = createSocket.call(nuxtApp, {
		name: "sessions",
		channel: "/sessions",
		autoConnect: false,
		auth: (callback: Function) => {
			callback({
				token: userStore.getToken
			})
		}
	})

	const userStateSocket = createSocket.call(nuxtApp, {
		name: "user",
		channel: "/user",
		autoConnect: false,
		auth: (callback: Function) => {
			callback({
				token: userStore.getToken
			})
		}
	})

	watch(
		() => userStore.getIsAuth,
		(isAuth) => {
			if (isAuth && userStore.getToken && !sessionSocket.connected) {
				sessionSocket.connect()
			} else if (!isAuth && sessionSocket.connected) {
				sessionSocket.disconnect()
			}

			if (isAuth && userStore.getToken && !userStateSocket.connected) {
				console.log("User state socket connect")
				userStateSocket.connect()
			} else if (!isAuth && userStateSocket.connected) {
				userStateSocket.disconnect()
			}
		},
		{ immediate: true }
	)

	return {
		provide: {
			sessionsSocket: sessionSocket,
			userStateSocket: userStateSocket
		}
	}
})
