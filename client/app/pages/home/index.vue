<template>
	<div class="mt-15">
		<h2 class="text-4xl max-md:text-2xl text-center">
			{{ $t("categories.allCategories") }}
		</h2>
		<div>
			<p class="text-justify text-xl m-auto mt-5 max-md:text-base">
				{{ $t("categories.allCategoriesDescription") }}
			</p>
			<p class="text-justify text-xl m-auto mt-5 max-md:text-base">
				{{ $t("categories.createTopicDescription") }}
			</p>
		</div>
		<BaseList :items="categories" />
		<LoadMoreButton
			v-if="isLoadMoreButtonShow"
			:is-loading="isLoadMoreButtonLoading"
			class="m-auto block mt-15 max-sm:text-xs"
			@load-more="incrementPage"
		/>
	</div>
</template>

<script setup lang="ts">
import { userAuthGuard } from "~/guards/user-auth.guard"
import { useCategoriesStore } from "~/store/categories/categories.store"
import LoadMoreButton from "~/components/LoadMoreButton.vue"
import { useAppStore } from "~/store/app-store"
import type { ListItem } from "~/components/BaseList.vue"
import type { CategoryItem } from "~/store/categories/interfaces/get-categories-response.interface"

const appStore = useAppStore()
const categoriesStore = useCategoriesStore()

const { locale } = useI18n()

const page = ref(1)
const limit = ref(20)
const categories = ref<Array<ListItem>>([])

const isLoadMoreButtonLoading = ref(false)
const isLoadMoreButtonShow = ref(false)

async function getCategories() {
	const response = await categoriesStore.getCategories(page.value, limit.value)

	if (response) {
		categories.value.push(
			...response.data.map(item => ({
				id: item.id,
				isLink: true,
				title: getCategoryItemTranslate(item),
				link: "/categories/" + item.id,
				emoji: item.emoji,
				subjects: item.subjects
			}))
		)
		isLoadMoreButtonShow.value = response.isLoadMoreAvailable
	}
}

function getCategoryItemTranslate(category: CategoryItem) {
	if (locale.value === "en" && category.translateNameEn) {
		return category.translateNameEn
	}
	if (locale.value === "uk" && category.translateNameUk) {
		return category.translateNameUk
	}
	if (locale.value === "ru" && category.translateNameRu) {
		return category.translateNameRu
	}
	return category.name
}

function incrementPage() {
	page.value += 1
}

watch(page, () => {
	isLoadMoreButtonLoading.value = true

	getCategories().then(() => {
		isLoadMoreButtonLoading.value = false
	})
})

onMounted(() => {
	appStore.setIsLoading(true)
	userAuthGuard()
	getCategories().then(() => appStore.setIsLoading(false))
})
</script>
