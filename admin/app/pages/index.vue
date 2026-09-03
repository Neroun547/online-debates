<template>
  <div>
    <div class="flex justify-between">
      <div class="text-2xl">Categories</div>
      <div>
        <UButton label="Create category" icon="lucide:plus" />
      </div>
    </div>
    <UTable
      :data="categories"
      :loading="isTableLoading"
      :columns="tableColumns"
    >
      <template #action-cell="{ row }">
        <div class="flex justify-end gap-5">
          <UTooltip text="Edit">
            <UButton icon="lucide:pencil" size="xs" class="cursor-pointer" />
          </UTooltip>

          <UTooltip text="Delete">
            <UButton
              icon="lucide:trash-2"
              size="xs"
              color="error"
              class="cursor-pointer"
              @click="openDeleteCategoryModal(row.original)"
            />
          </UTooltip>
        </div>
      </template>
    </UTable>
    <div class="flex justify-end border-t border-default pt-4 px-4">
      <UPagination
        :page="page"
        :items-per-page="limit"
        :total="totalCategoriesCount"
        @update:page="(p) => updatePage(p)"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import type { CategoryItem } from "~/store/categories/interfaces/get-categories-response.interface";
import { authGuard } from "../guards/auth.guard";
import { useCategoriesStore } from "~/store/categories/categories.store";
import type { TableColumn } from "@nuxt/ui";
import BaseDeleteModal from "~/components/BaseDeleteModal.vue";

const overlay = useOverlay();
const deleteCategoryModal = overlay.create(BaseDeleteModal);

const categoriesStore = useCategoriesStore();

const isTableLoading = ref(false);
const categories = ref<CategoryItem[]>([]);
const totalCategoriesCount = ref(0);

const tableColumns: TableColumn<CategoryItem>[] = [
  {
    accessorKey: "id",
  },
  {
    accessorKey: "name",
  },
  {
    accessorKey: "priority",
  },
  {
    id: "action",
  },
];

const page = ref(1);
const limit = 20;

async function openDeleteCategoryModal(category: CategoryItem) {
  const result = await deleteCategoryModal.open({
    title: "Delete " + category.name,
    description:
      "Do you really want delete " +
      category.name +
      " ? All data connected to this category will be lost",
  });

  if (result) {
    await categoriesStore.deleteCategoryById(category.id);

    getCategories();
  }
}

function updatePage(pageArg: number) {
  page.value = pageArg;
}

async function getCategories() {
  isTableLoading.value = true;
  const response = await categoriesStore.getCategories(page.value, limit);

  if (response && response.data) {
    categories.value = response.data;
    totalCategoriesCount.value = response.count;
  }
  isTableLoading.value = false;
}

watch(page, () => {
  getCategories();
});

onMounted(() => {
  authGuard().then(() => {
    getCategories();
  });
});
</script>
