import { useUserStore } from "~/store/auth/user.store";

export function userAuthGuard() {
    if(window) {
        const userStore = useUserStore();

        if(userStore.getIsAuth) {
            return;
        } 
        window.location.href = "/auth";
    }
}

