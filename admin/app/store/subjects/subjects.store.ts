import { useApiFetch } from "~/libs/use-api-fetch";
import type { BaseStoreInterface } from "../interfaces/base-store.interface";
import type { SaveSubjectRequestInterface } from "../interfaces/save-subject-request.interface";
import type { GetSubjectsResponseInterface } from "./interfaces/get-subjects-response.interface";
import type { UpdateSubjectRequestInterface } from "./interfaces/update-subject-request.interface";

export const useSubjectStore = defineStore("subjects", {
    state: (): BaseStoreInterface => ({
        isError: false
    }),
    actions: {
        async updateSubjectById(params: UpdateSubjectRequestInterface) {
            try {
                this.clearError();

                await useApiFetch(`/admin/subjects/${params.id}`, { method: "PUT", body: { userId: params.userId, categoryId: params.categoryId, name: params.name } });
            } catch(error: any) {
                this.setError(error.response._data.message);
            }
        },
        async deleteSubjectByCategoryIdAndSubjectId(subjectId: number, categoryId: number) {
            try {
                this.clearError();
                
                await useApiFetch(`/admin/subjects?subjectId=${subjectId}&categoryId=${categoryId}`, { method: "DELETE" });
            } catch(error: any) {
                this.setError(error.response._data.message);
            }
        },
        async saveSubject(data: SaveSubjectRequestInterface) {
            try {
                this.clearError();

                await useApiFetch(`/admin/subjects`, { method: "POST", body: data });
            } catch(error: any) {
                this.setError(error.response._data.message);
            }
        },
        async getSubjects(page: number, limit: number): Promise<GetSubjectsResponseInterface | undefined> {
            try {
                this.clearError();

                return await useApiFetch<GetSubjectsResponseInterface>(`/admin/subjects?page=${page}&limit=${limit}`, { method: "GET" });
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

