<template>
  <UModal>
    <template #title>
      <h2>Create subject</h2>
    </template>
    <template #body>
      <UForm :state="formState" :schema="formSchema" @submit="saveSubject">
        <UFormField label="Name" class="w-full" name="name">
          <UInput
            placeholder="Name:"
            class="w-full"
            v-model="formState.name"
            name="name"
          />
        </UFormField>
        <UFormField label="Category" class="w-1/2 mt-5" name="category">
          <USelectMenu
            :items="categories"
            ref="categoriesSelect"
            value-key="id"
            label-key="name"
            class="w-full"
            @update:search-term="onCategoriesSelectSearch"
            v-model="formState.category"
            name="category"
          />
        </UFormField>
        <USeparator class="mt-5 mb-5" />
        <div class="flex justify-end">
          <div class="flex">
            <UButton
              label="Cancel"
              color="error"
              class="mr-3 cursor-pointer"
              @click="emit('close', false)"
            />
            <UButton label="Save" type="submit" class="cursor-pointer" />
          </div>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
<script setup lang="ts">
import { useInfiniteScroll } from "@vueuse/core";
import { useCategoriesStore } from "~/store/categories/categories.store";
import type { CategoryItem } from "~/store/categories/interfaces/get-categories-response.interface";
import * as zod from "zod";

interface FormState {
  name: string;
  category: number | undefined;
}

const formSchema = zod.object({
  name: zod.string().trim().min(1).max(500),
  category: zod.number(),
});

const formState = reactive<FormState>({
  name: "",
  category: undefined,
});

const categoriesStore = useCategoriesStore();
const categoriesSelect = useTemplateRef("categoriesSelect");

const page = ref(1);
const limit = 20;
const categories = ref<CategoryItem[]>([]);

const isCategoriesLoading = ref(false);
const isLoadMorePossible = ref(true);

const currentSearchName = ref<string>("");
const isSearchByNameProgress = ref<boolean>(false);

const emit = defineEmits(["close"]);

function saveSubject(e: Event) {
  e.preventDefault();

  emit("close", {
    name: formState.name,
    category: formState.category,
  });
}

function onCategoriesSelectSearch(value: string) {
  currentSearchName.value = value;
  page.value = 1;
}

async function getCategories(isSearch?: boolean) {
  isCategoriesLoading.value = true;

  const response = await categoriesStore.getCategories(
    page.value,
    limit,
    currentSearchName.value.trim() ? currentSearchName.value.trim() : undefined,
  );

  if (response && response.data) {
    if (isSearch) {
      const parsedResponse = parseResponse(response.data);
      const currentCategory = categories.value.find(
        (category) => formState.category === category.id,
      );

      categories.value = currentCategory
        ? [currentCategory, ...parsedResponse]
        : parsedResponse;
    } else {
      const parsedResponse = parseResponse(response.data);
      categories.value.push(...parsedResponse);
    }
    isLoadMorePossible.value = response.count > categories.value.length;
  } else {
    isLoadMorePossible.value = false;
  }
  isCategoriesLoading.value = false;
}

function parseResponse(data: CategoryItem[]) {
  return data.filter(
    (item) =>
      categories.value.findIndex((category) => category.id === item.id) === -1,
  );
}

watch(page, () => {
  if (!isSearchByNameProgress.value) {
    getCategories(false);
  }
});

watch(currentSearchName, () => {
  isSearchByNameProgress.value = true;
  getCategories(true).then(() => {
    isSearchByNameProgress.value = false;
  });
});

onMounted(() => {
  useInfiniteScroll(
    () => categoriesSelect.value?.viewportRef,
    () => {
      page.value += 1;
    },
    {
      canLoadMore: () => {
        return !isCategoriesLoading.value && isLoadMorePossible.value;
      },
    },
  );

  getCategories(false).then(() => {
    if (categories.value && categories.value[0]) {
      formState.category = categories.value[0].id;
    }
  });
});
</script>
