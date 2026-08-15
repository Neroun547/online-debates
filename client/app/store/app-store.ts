import type { AppStoreInterface } from "./app-store.interface";

export const useAppStore = defineStore("appStore", {
    state: (): AppStoreInterface => ({
        isPageLoading: true,
        isSideNavHidden: false,
        isGoBackButtonVisible: false,
        goBackAction: undefined,
        isSessionPage: false
    }),
    actions: {
        setIsLoading(value: boolean) {
            this.isPageLoading = value;
        },
        setIsSideNavHidden(value: boolean) {
            this.isSideNavHidden = value;
        },
        setIsGoBackButtonVisible(value: boolean) {
            this.isGoBackButtonVisible = value;
        },
        setGoBackAction(action: Function) {
            this.goBackAction = action;
        },
        setIsSessionPage(value: boolean) {
            this.isSessionPage = value;
        }
    },
    getters: {
        getIsLoading: (state) => {
            return state.isPageLoading;
        }
    }
});

