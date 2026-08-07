import { useApiFetch } from "~/libs/useApiFetch";
import type { CategoriesStore } from "./interfaces/categories-store.interface";
import type { CategoryItem, GetCategoriesResponseInterface } from "./interfaces/get-categories-response.interface";
import type { GetSubjectsResponseInterface, SubjectItem } from "./interfaces/get-subjects-response.interface";

export const useCategoriesStore = defineStore("categories", {
    state: (): CategoriesStore => ({
        errorMessage: undefined,
        isError: false
    }),
    actions: {
        async getCategories(page: number, limit: number): Promise<GetCategoriesResponseInterface | undefined> {
            try {
                const response = await useApiFetch<GetCategoriesResponseInterface>(`/categories?page=${page}&limit=${limit}`, { method: "GET" });

                return response;
            } catch(error: any) {
                this.setError(error.response._data.message);
            }
        },
        async getSubjectsByCategoryId(categoryId: number, page: number, limit: number): Promise<GetSubjectsResponseInterface | undefined> {
            try {
                const response = await useApiFetch<GetSubjectsResponseInterface>(`/subjects?page=${page}&limit=${limit}&categoryId=${categoryId}`);

                return response;
            } catch(error: any) {
                this.setError(error.response._data.message);
            }
        },
        async getCategoryById(id: number): Promise<CategoryItem | undefined> {
            try {
                const response = await useApiFetch<CategoryItem>(`/categories/${id}`);

                return response;
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
})