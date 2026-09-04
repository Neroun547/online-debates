import { useApiFetch } from "~/libs/use-api-fetch";
import type { BaseStoreInterface } from "../interfaces/base-store.interface";

export const useSubjectStore = defineStore("subjects", {
    state: (): BaseStoreInterface => ({
        isError: false
    }),
    actions: {
        async deleteSubjectByCategoryIdAndSubjectId(subjectId: number, categoryId: number) {
            try {
                this.clearError();
                
                await useApiFetch(`/admin/subjects?subjectId=${subjectId}&categoryId=${categoryId}`, { method: "DELETE" });
            } catch(error: any) {
                this.setError(error.response._data.message);
            }
        },
        clearError() {
            this.isError = false;
            this.errorMessage = undefined;
        },
        setError(error: any) {
            this.isError = true;
            this.errorMessage = getErrorMessage(error);
        }
    }  
});

