<template>
  <div v-if="currentCategory">
    <div class="mt-15">
      <div v-if="subjects.length">
        <h2 class="text-4xl text-center">{{ currentCategory?.name }}</h2>
        <div class="mt-15">
          <BaseList :items="subjects" />
        </div>
        <LoadMoreButton
          v-if="isLoadMoreAvailable"
          @load-more="incrementPage"
          :is-loading="isLoadMoreButtonLoading"
          class="m-auto block mt-15"
        />
      </div>
      <div v-if="!subjects.length">
        <h2 class="text-4xl max-md:text-2xl max-sm:text-xl text-center">
          {{ $t("categories.noSubjects") }}
        </h2>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { ListItem } from "~/components/BaseList.vue";
import { useAppStore } from "~/store/app-store";
import { useCategoriesStore } from "~/store/categories/categories.store";
import type { CategoryItem } from "~/store/categories/interfaces/get-categories-response.interface";

const subjects = ref<ListItem[]>([]);
const route = useRoute();

const page = ref(1);
const limit = ref(20);

const categoriesStore = useCategoriesStore();
const currentCategory = ref<CategoryItem>();

const isLoadMoreAvailable = ref(false);
const isLoadMoreButtonLoading = ref(false);

const appStore = useAppStore();

function incrementPage() {
  page.value += 1;
}

async function getSubjects() {
  const response = await categoriesStore.getSubjects({
    limit: limit.value,
    page: page.value,
    categoryId: Number(route.params.id),
  });

  if (response) {
    subjects.value.push(
      ...response.data.map((item) => ({
        title: item.name,
        isLink: true,
        link: "/categories/" + Number(route.params.id) + "/subjects/" + item.id,
      })),
    );
    isLoadMoreAvailable.value = response.isLoadMoreAvailable;
  }
}

async function getCategory() {
  const data = await categoriesStore.getCategoryById(Number(route.params.id));

  if (data) {
    currentCategory.value = data;
  }
}

watch(page, () => {
  isLoadMoreButtonLoading.value = true;
  getSubjects().then(() => (isLoadMoreButtonLoading.value = false));
});

onMounted(() => {
  appStore.setIsLoading(true);

  Promise.all([getSubjects(), getCategory()]).then(() =>
    appStore.setIsLoading(false),
  );
});
</script>
