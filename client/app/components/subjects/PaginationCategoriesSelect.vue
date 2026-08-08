<script setup lang="ts">
import { useCategoriesStore } from "~/store/categories/categories.store";
import type { CategoryItem } from "~/store/categories/interfaces/get-categories-response.interface";

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
      ? response.data
      : [...categories.value, ...response.data];

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
    class="w-full"
  >
    <template #empty>
      <span>
        {{ loading ? "Loading..." : "No categories found" }}
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
