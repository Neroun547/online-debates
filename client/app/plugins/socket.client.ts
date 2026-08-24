import { useUserStore } from "~/store/user/user.store";
import type { SessionsSocket } from "~/types/sessions-socket.interface";

interface SocketPluginResult {
  provide: {
    sessionsSocket: SessionsSocket;
  };
}

export default defineNuxtPlugin((nuxtApp): SocketPluginResult => {
    const userStore = useUserStore();

    const createSocket = nuxtApp.$nuxtSocket as unknown as (
      this: typeof nuxtApp,
      options: Record<string, unknown>,
    ) => SessionsSocket;
    const sessionSocket = createSocket.call(nuxtApp, {
        name: "sessions",
        channel: "/sessions",
        autoConnect: false,
        auth: (callback: Function) => {
            callback({
                token: userStore.getToken,
            });
        },
    });

    watch(
        () => userStore.getIsAuth,
        (isAuth) => {
            if (isAuth && userStore.getToken && !sessionSocket.connected) {
                sessionSocket.connect();
            } else if (!isAuth && sessionSocket.connected) {
                sessionSocket.disconnect();
            }
        },
        { immediate: true }
    );

  return {
    provide: {
      sessionsSocket: sessionSocket,
    },
  };
});
