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
    const socket = createSocket.call(nuxtApp, {
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
            if (isAuth && userStore.getToken && !socket.connected) {
                socket.connect();
            } else if (!isAuth && socket.connected) {
                socket.disconnect();
            }
        },
        { immediate: true }
    );

  return {
    provide: {
      sessionsSocket: socket,
    },
  };
});
