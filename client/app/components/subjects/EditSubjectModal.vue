<template>
	<UModal
v-model:open="isOpen"
:title="props.modalTitle"
>
		<template #body>
			<UForm
				:schema="formSchema"
				:state="formState"
				@submit.prevent="editSubject"
			>
				<UFormField
					name="categoryId"
					:label="$t('mySubjects.editSubjectModal.category')"
				>
					<PaginationCategoriesSelect
						v-model="formState.categoryId"
						name="categoryId"
					/>
				</UFormField>
				<UFormField
					name="name"
					:label="$t('mySubjects.editSubjectModal.subjectName')"
					class="w-full mt-5"
				>
					<UInput
						v-model="formState.name"
						:placeholder="$t('mySubjects.editSubjectModal.subjectName')"
						name="name"
						class="w-full"
					/>
				</UFormField>

				<div class="mt-10 ml-auto w-max">
					<UButton
						:label="$t('mySubjects.editSubjectModal.editSubject')"
						type="submit"
						class="cursor-pointer max-sm:text-xs"
					/>
				</div>
			</UForm>
		</template>
	</UModal>
</template>

<script setup lang="ts">
import PaginationCategoriesSelect from "./PaginationCategoriesSelect.vue"
import { z } from "zod"

interface Props {
	modalTitle: string
	name: string
	categoryId: number
}

const isOpen = defineModel<boolean>("isOpen")
const props = defineProps<Props>()

const emit = defineEmits(["update"])

const formSchema = z.object({
	categoryId: z.number(),
	name: z.string().min(1).max(500)
})

const formState = ref({
	name: "",
	categoryId: -1
})

function editSubject() {
	emit("update", formState.value)
}

watch(
	props,
	() => {
		formState.value.name = props.name
		formState.value.categoryId = props.categoryId
	},
	{ immediate: true }
)
</script>
