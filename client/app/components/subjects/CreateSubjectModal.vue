<template>
	<UModal
		v-model:open="isModalOpen"
		:title="$t('mySubjects.createSubjectModal.title')"
	>
		<template #body>
			<UForm
				:schema="formSchema"
				:state="formState"
				@submit.prevent="createSubject"
			>
				<UFormField
					name="categoryId"
					:label="$t('mySubjects.createSubjectModal.category')"
				>
					<PaginationCategoriesSelect
						v-model="formState.categoryId"
						name="categoryId"
					/>
				</UFormField>
				<UFormField
					name="name"
					:label="$t('mySubjects.createSubjectModal.subjectName')"
					class="w-full mt-5"
				>
					<UInput
						v-model="formState.name"
						:placeholder="$t('mySubjects.createSubjectModal.subjectName')"
						name="name"
						class="w-full"
					/>
				</UFormField>

				<div class="mt-10 ml-auto w-max">
					<UButton
						:label="$t('mySubjects.createSubjectModal.createSubject')"
						type="submit"
						class="cursor-pointer max-sm:text-xs"
					/>
				</div>
			</UForm>
		</template>
	</UModal>
</template>

<script setup lang="ts">
import { z } from "zod"
import PaginationCategoriesSelect from "./PaginationCategoriesSelect.vue"
import { useCategoriesStore } from "~/store/categories/categories.store.ts"

const { t } = useI18n()

const emit = defineEmits(["createdNew"])

const toast = useToast()

const categoriesStore = useCategoriesStore()

const isModalOpen = defineModel<boolean>("isModalOpen", {
	default: false,
	type: Boolean
})

const formSchema = z.object({
	categoryId: z.number(),
	name: z.string().min(1).max(500)
})

const formState = ref({
	categoryId: -1,
	name: ""
})

async function createSubject() {
	await categoriesStore.createSubject(formState.value)

	if (categoriesStore.isError) {
		toast.add({
			title: t("mySubjects.createSubjectModal.error"),
			description: categoriesStore.errorMessage,
			progress: {
				color: "error"
			}
		})
	} else {
		toast.add({
			title: t("mySubjects.createSubjectModal.success"),
			description: t("mySubjects.createSubjectModal.createdSuccessfully"),
			progress: {
				color: "success"
			}
		})
		emit("createdNew")

		isModalOpen.value = false
	}
}
</script>
