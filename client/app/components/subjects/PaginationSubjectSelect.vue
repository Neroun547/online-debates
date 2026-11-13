<script setup lang="ts">
import { useCategoriesStore } from "~/store/categories/categories.store";
import type { SubjectItem } from "~/store/categories/interfaces/get-subjects-response.interface";

const props = defineProps({
	limit: {
		type: Number,
		default: 20
	},
	categoryId: {
		type: Number
	}
});

const selectedSubjectId = defineModel<number | null>({ default: null });

const categoriesStore = useCategoriesStore();

const subjects = ref<SubjectItem[]>([]);
const page = ref(1);
const loading = ref(false);
const isLoadMoreAvailable = ref(false);

let requestId = 0;

async function loadSubjects(targetPage = 1, reset = false) {
	if (
		props.categoryId === -1 ||
		props.categoryId === undefined ||
		props.categoryId === null
	) {
		return;
	}
	if (loading.value && !reset) {
		return;
	}

	const currentRequestId = ++requestId;

	if (reset) {
		subjects.value = [];
		isLoadMoreAvailable.value = false;
	}

	loading.value = true;

	try {
		const response = await categoriesStore.getSubjects({
			page: targetPage,
			limit: props.limit,
			categoryId: props.categoryId
		});

		if (currentRequestId !== requestId || !response) {
			return;
		}

		subjects.value = reset
			? response.data
			: [...subjects.value, ...response.data];

		page.value = targetPage;
		isLoadMoreAvailable.value = response.isLoadMoreAvailable;

		if (selectedSubjectId.value === -1) {
			selectedSubjectId.value = subjects.value[0]?.id ?? null;
		}
	} finally {
		if (currentRequestId === requestId) {
			loading.value = false;
		}
	}
}

function loadNextPage() {
	if (!loading.value && isLoadMoreAvailable.value) {
		loadSubjects(page.value + 1);
	}
}

watch(
	() => props.categoryId,
	(_, previousCategoryId) => {
		if (previousCategoryId !== undefined && previousCategoryId !== null) {
			selectedSubjectId.value = null;
		}

		loadSubjects(1, true);
	},
	{ immediate: true }
);
</script>

<template>
	<USelectMenu
		v-model="selectedSubjectId"
		:items="subjects"
		:loading="loading"
		clear
		value-key="id"
		label-key="name"
		placeholder="Select subject"
		:search-input="{
			placeholder: 'Search subjects...'
		}"
		:ui="{
			placeholder: 'max-sm:text-xs'
		}"
		class="w-full max-sm:text-xs"
	>
		<template #empty>
			<span class="max-sm:text-xs">
				{{ loading ? $t("loading") + "..." : $t("noSubjectsFound") }}
			</span>
		</template>

		<template #content-bottom>
			<div v-if="isLoadMoreAvailable" class="border-default border-t p-2">
				<UButton
					label="Load more"
					variant="ghost"
					color="neutral"
					class="w-full justify-center"
					:loading="loading"
					@click.stop="loadNextPage"
				/>
			</div>
		</template>
	</USelectMenu>
</template>
