import { useUserStore } from "~/store/user/user.store";

export function redirectAuthUser() {
    const userStore = useUserStore();

    if(userStore.isAuth) {
        window.location.href = "/home";
    }
}

