import { useApiFetch } from "~/libs/useApiFetch";
import type { CategoriesStore } from "./interfaces/categories-store.interface";
import type {
	CategoryItem,
	GetCategoriesResponseInterface
} from "./interfaces/get-categories-response.interface";
import type { GetSubjectsResponseInterface } from "./interfaces/get-subjects-response.interface";
import type { CreateSubjectRequestInterface } from "./interfaces/create-subject-request.interface";
import type { GetSubjectByIdResponseInterface } from "./interfaces/get-subject-by-id-response.interface";

export const useCategoriesStore = defineStore("categories", {
	state: (): CategoriesStore => ({
		errorMessage: undefined,
		isError: false
	}),
	actions: {
		async getSubjectById(
			subjectId: number
		): Promise<GetSubjectByIdResponseInterface | undefined> {
			try {
				this.clearError();

				return await useApiFetch<GetSubjectByIdResponseInterface>(
					"/subjects/" + subjectId
				);
			} catch (error: any) {
				this.setError(error.response._data.message);
			}
		},
		async updateSubject(subject: {
			name: string;
			categoryId: number;
			id: number;
		}) {
			try {
				this.clearError();

				await useApiFetch("/subjects/" + subject.id, {
					method: "PUT",
					body: {
						name: subject.name,
						categoryId: subject.categoryId
					}
				});
			} catch (error: any) {
				this.setError(error.response._data.message);
			}
		},
		async deleteSubjectById(id: number) {
			try {
				this.clearError();

				await useApiFetch("/subjects/" + id, { method: "DELETE" });
			} catch (error: any) {
				this.setError(error.response._data.message);
			}
		},
		async createSubject(subject: CreateSubjectRequestInterface) {
			try {
				this.clearError();

				await useApiFetch("/subjects", { method: "POST", body: subject });
			} catch (error: any) {
				this.setError(error.response._data.message);
			}
		},
		async getCategories(
			page: number,
			limit: number
		): Promise<GetCategoriesResponseInterface | undefined> {
			try {
				this.clearError();

				const response = await useApiFetch<GetCategoriesResponseInterface>(
					`/categories?page=${page}&limit=${limit}`,
					{ method: "GET" }
				);

				return response;
			} catch (error: any) {
				this.setError(error.response._data.message);
			}
		},
		async getUserSubjects(params: {
			page: number;
			limit: number;
			categoryId?: number;
		}): Promise<GetSubjectsResponseInterface | undefined> {
			try {
				this.clearError();

				let url = `/user/subjects?page=${params.page}&limit=${params.limit}`;

				if (params.categoryId) {
					url += `&categoryId=${params.categoryId}`;
				}
				const response = await useApiFetch<GetSubjectsResponseInterface>(url);

				return response;
			} catch (error: any) {
				this.setError(error.response._data.message);
			}
		},
		async getSubjects(params: {
			page: number;
			limit: number;
			categoryId?: number;
			userId?: number;
		}): Promise<GetSubjectsResponseInterface | undefined> {
			try {
				this.clearError();

				let url = `/subjects?page=${params.page}&limit=${params.limit}`;

				if (params.userId) {
					url += `&userId=${params.userId}`;
				}
				if (params.categoryId) {
					url += `&categoryId=${params.categoryId}`;
				}
				const response = await useApiFetch<GetSubjectsResponseInterface>(url);

				return response;
			} catch (error: any) {
				this.setError(error.response._data.message);
			}
		},
		async getCategoryById(id: number): Promise<CategoryItem | undefined> {
			try {
				this.clearError();

				const response = await useApiFetch<CategoryItem>(`/categories/${id}`);

				return response;
			} catch (error: any) {
				this.setError(error.response._data.message);
			}
		},
		async getTheMostPopularCategories(): Promise<CategoryItem[] | undefined> {
			try {
				this.clearError();

				return await useApiFetch<CategoryItem[]>("/categories/popular", {
					method: "GET"
				});
			} catch (error: any) {
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
