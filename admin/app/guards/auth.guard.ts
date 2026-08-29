import { useAuthStore } from "~~/store/auth/auth.store";

export async function authGuard() {
    const authStore = useAuthStore();

    await authStore.checkAuth();

    if(authStore.isError) {
        window.location.href = "/auth";
    }
}

