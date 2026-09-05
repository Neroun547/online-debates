<template>
  <div>
    <div class="flex justify-between">
      <div class="text-2xl">Categories</div>
      <div>
        <UButton
          label="Create category"
          icon="lucide:plus"
          @click="openCreateCategoryModal"
        />
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
            <UButton
              icon="lucide:pencil"
              size="xs"
              class="cursor-pointer"
              @click="openUpdateCategoryModal(row.original)"
            />
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
import UpdateCategoryModal from "~/components/categories/UpdateCategoryModal.vue";
import { useSubjectStore } from "~/store/subjects/subjects.store";
import { ActionType } from "~/components/categories/enums/action-type.enum";
import CreateCategoryModal from "~/components/categories/CreateCategoryModal.vue";

const toast = useToast();

const overlay = useOverlay();
const createCategoryModal = overlay.create(CreateCategoryModal);
const deleteCategoryModal = overlay.create(BaseDeleteModal);
const updateCategoryModal = overlay.create(UpdateCategoryModal);

const categoriesStore = useCategoriesStore();
const subjectsStore = useSubjectStore();

const isTableLoading = ref(false);
const categories = ref<CategoryItem[]>([]);
const totalCategoriesCount = ref(0);

const isCategoriesLoading = ref(false);

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

async function openCreateCategoryModal() {
  const result = await createCategoryModal.open();

  if (result && typeof result === "object") {
    await categoriesStore.createCategory({
      name: result.name,
      priority: result.priority,
    });

    if (categoriesStore.isError) {
      toast.add({
        title: "Error",
        description: categoriesStore.errorMessage,
        color: "error",
      });
    } else {
      toast.add({
        title: "Success",
        description: "Category created successfully",
        color: "success",
      });

      isCategoriesLoading.value = true;
      page.value = 1;

      await getCategories();

      isCategoriesLoading.value = false;
    }
  }
}

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

    isCategoriesLoading.value = true;
    page.value = 1;
    await getCategories();

    isCategoriesLoading.value = false;
  }
}

async function openUpdateCategoryModal(category: CategoryItem) {
  const result = await updateCategoryModal.open({
    name: category.name,
    priority: category.priority,
    subjects: category.subjects,
  });
  if (
    result &&
    typeof result === "object" &&
    result.type === ActionType.update
  ) {
    await categoriesStore.updateCategoryById(category.id, {
      name: result.name,
      priority: result.priority,
    });

    if (!categoriesStore.isError) {
      getCategories();

      toast.add({
        title: "Category updated successfully",
        color: "success",
      });
    } else {
      toast.add({
        title: "Error",
        description: categoriesStore.errorMessage,
        color: "error",
      });
    }
  }
  if (
    result &&
    typeof result === "object" &&
    result.type === ActionType.delete
  ) {
    await subjectsStore.deleteSubjectByCategoryIdAndSubjectId(
      result.id,
      result.categoryId,
    );

    if (!subjectsStore.isError) {
      getCategories();

      toast.add({
        title: "Subject delete successfully",
        color: "success",
      });
    } else {
      toast.add({
        title: "Error",
        description: subjectsStore.errorMessage,
      });
    }
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
  if (!isCategoriesLoading.value) {
    getCategories();
  }
});

onMounted(() => {
  authGuard().then(() => {
    getCategories();
  });
});
</script>
