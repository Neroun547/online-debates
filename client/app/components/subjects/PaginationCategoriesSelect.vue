<script setup lang="ts">
import { useCategoriesStore } from "~/store/categories/categories.store";
import type { CategoryItem } from "~/store/categories/interfaces/get-categories-response.interface";

const { locale } = useI18n();

const props = defineProps({
  limit: {
    type: Number,
    default: 20,
  },
});

const selectedCategoryId = defineModel<number | null>({ default: null });

const categoriesStore = useCategoriesStore();

const categories = ref<CategoryItem[]>([]);
const page = ref(1);
const loading = ref(false);
const isLoadMoreAvailable = ref(false);

let requestId = 0;

async function loadCategories(targetPage = 1, reset = false) {
  if (loading.value && !reset) {
    return;
  }

  const currentRequestId = ++requestId;

  if (reset) {
    categories.value = [];
    isLoadMoreAvailable.value = false;
  }

  loading.value = true;

  try {
    const response = await categoriesStore.getCategories(
      targetPage,
      props.limit,
    );

    if (currentRequestId !== requestId || !response) {
      return;
    }

    categories.value = reset
      ? response.data.map(item => mapCategoryWithTranslate(item))
      : [...categories.value, ...response.data].map(item => mapCategoryWithTranslate(item));

    page.value = targetPage;
    isLoadMoreAvailable.value = response.isLoadMoreAvailable;
    // Set initial value
    if (selectedCategoryId.value === -1) {
      selectedCategoryId.value = categories.value[0]?.id ?? null;
    }
  } finally {
    if (currentRequestId === requestId) {
      loading.value = false;
    }
  }
}

function mapCategoryWithTranslate(category: CategoryItem) {
  if(locale.value === "en" && category.translateNameEn) {
    return {
      ...category,
      name: category.translateNameEn
    }
  }
  if(locale.value === "uk" && category.translateNameUk) {
    return {
      ...category,
      name: category.translateNameUk
    }
  }
  if(locale.value === "ru" && category.translateNameRu) {
    return {
      ...category,
      name: category.translateNameRu
    }
  }
  return category;
}

function loadNextPage() {
  if (!loading.value && isLoadMoreAvailable.value) {
    loadCategories(page.value + 1);
  }
}

onMounted(() => {
  loadCategories(1, true);
});
</script>

<template>
  <USelectMenu
    v-model="selectedCategoryId"
    :items="categories"
    :loading="loading"
    clear
    value-key="id"
    label-key="name"
    placeholder="Select category"
    :search-input="{
      placeholder: 'Search categories...',
    }"
    :ui="{
      placeholder: 'max-sm:text-xs',
    }"
    class="w-full max-sm:text-xs"
  >
    <template #empty>
      <span class="max-sm:text-xs">
        {{ loading ? $t("loading") + "..." : $t("noCategoriesFound") }}
      </span>
    </template>

    <template #content-bottom>
      <div v-if="isLoadMoreAvailable" class="border-default border-t p-2">
        <UButton
          :label="$t('loadMore')"
          variant="ghost"
          color="neutral"
          class="w-full justify-center max-sm:text-xs"
          :loading="loading"
          @click.stop="loadNextPage"
        />
      </div>
    </template>
  </USelectMenu>
</template>
