import type { AppStoreInterface } from "./app-store.interface";

export const useAppStore = defineStore("appStore", {
    state: (): AppStoreInterface => ({
        isPageLoading: true
    }),
    actions: {
        setIsLoading(value: boolean) {
            this.isPageLoading = value;
        }
    },
    getters: {
        getIsLoading: (state) => {
            return state.isPageLoading;
        }
    }
});

