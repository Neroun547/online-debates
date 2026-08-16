<template>
  <div class="mt-15">
    <h2 class="text-4xl text-center">All categories</h2>
    <div>
      <p class="text-justify text-xl m-auto mt-5">
        This page contains all the communication categories available in the
        system. Each category contains user-created topics. Select a topic, then
        a user, and start a conversation.
      </p>
      <p class="text-justify text-xl m-auto mt-5">
        You can also create your own discussion topic in one of the available
        categories on the "My Topics" page. Enjoy!
      </p>
    </div>
    <BaseList :items="categories" />
    <LoadMoreButton
      @load-more="incrementPage"
      :is-loading="isLoadMoreButtonLoading"
      class="m-auto block mt-15"
      v-if="isLoadMoreButtonShow"
    />
  </div>
</template>
<script setup lang="ts">
import { userAuthGuard } from "~/guards/user-auth.guard";
import { useCategoriesStore } from "~/store/categories/categories.store";
import LoadMoreButton from "~/components/LoadMoreButton.vue";
import { useAppStore } from "~/store/app-store";
import type { ListItem } from "~/components/BaseList.vue";

const appStore = useAppStore();
const categoriesStore = useCategoriesStore();

const page = ref(1);
const limit = ref(20);
const categories = ref<Array<ListItem>>([]);

const isLoadMoreButtonLoading = ref(false);
const isLoadMoreButtonShow = ref(false);

async function getCategories() {
  const response = await categoriesStore.getCategories(page.value, limit.value);

  if (response) {
    categories.value.push(
      ...response.data.map((item) => ({
        isLink: true,
        title: item.name,
        link: "/categories/" + item.id,
      })),
    );
    isLoadMoreButtonShow.value = response.isLoadMoreAvailable;
  }
}

function incrementPage() {
  page.value += 1;
}

watch(page, () => {
  isLoadMoreButtonLoading.value = true;

  getCategories().then(() => {
    isLoadMoreButtonLoading.value = false;
  });
});

onMounted(() => {
  appStore.setIsLoading(true);
  userAuthGuard();
  getCategories().then(() => appStore.setIsLoading(false));
});
</script>
