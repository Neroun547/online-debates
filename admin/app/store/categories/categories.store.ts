import { defineStore } from "pinia";
import type { BaseStoreInterface } from "../interfaces/base-store.interface";
import { useApiFetch } from "~/libs/use-api-fetch";
import type { GetCategoriesResponseInterface } from "./interfaces/get-categories-response.interface";
import type { UpdateCategoryRequestDto } from "./interfaces/update-category-request.interface";

export const useCategoriesStore = defineStore("categories", {
    state: (): BaseStoreInterface => ({
        isError: false,
        errorMessage: undefined
    }),
    actions: {
        async getCategories(page: number, limit: number) {
            try {
                this.clearError();

                const response = await useApiFetch<GetCategoriesResponseInterface>(`/admin/categories?page=${page}&limit=${limit}`, { method: "GET" });

                return response;
            } catch(error: any) {
                this.setError(error.response._data.message);
            }
        },
        async deleteCategoryById(id: number) {
            try {
                this.clearError();

                await useApiFetch(`/admin/categories/` + id, { method: "DELETE" });
            } catch(error: any) {
                this.setError(error.response._data.message);
            }
        },
        async updateCategoryById(id: number, data: UpdateCategoryRequestDto) {
            try {
                this.clearError();

                await useApiFetch(`/admin/categories/` + id, { method: "PUT", body: data });
            } catch(error: any) {
                this.setError(error);
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

