<template>
  <div>
    <div class="flex justify-between">
      <div class="text-2xl">Subjects</div>
      <div>
        <UButton
          label="Create subject"
          icon="lucide:plus"
          @click="openCreateSubjectModal"
        />
      </div>
    </div>

    <UTable :data="subjects" :columns="tableColumns" :loading="isTableLoading">
      <template #user-cell="{ row }">
        {{ row.original.user ? row.original.user.email : "No user" }}
      </template>
      <template #category-cell="{ row }">
        {{ row.original.category.name }}
      </template>
      <template #actions-cell="{ row }">
        <div class="flex justify-end gap-5">
          <UTooltip text="Edit subject">
            <UButton
              icon="lucide:pencil"
              size="xs"
              class="cursor-pointer"
              @click="openUpdateSubjectModal(row.original)"
            />
          </UTooltip>
          <UTooltip text="Delete subject">
            <UButton
              icon="lucide:trash-2"
              size="xs"
              color="error"
              class="cursor-pointer"
              @click="openDeleteSubjectModal(row.original)"
            />
          </UTooltip>
        </div>
      </template>
    </UTable>
    <UPagination
      :page="page"
      :items-per-page="limit"
      :total="totalSubjectsCount"
      @update:page="(p) => updatePage(p)"
    />
  </div>
</template>
<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import BaseDeleteModal from "~/components/BaseDeleteModal.vue";
import CreateSubjectModal from "~/components/subjects/CreateSubjectModal.vue";
import UpdateSubjectModal from "~/components/subjects/UpdateSubjectModal.vue";
import type { SubjectItem } from "~/store/subjects/interfaces/get-subjects-response.interface";
import { useSubjectStore } from "~/store/subjects/subjects.store";

const tableColumns: TableColumn<SubjectItem>[] = [
  {
    accessorKey: "id",
  },
  {
    accessorKey: "name",
  },
  {
    accessorKey: "user",
    id: "user",
  },
  {
    accessorKey: "category",
    id: "category",
  },
  {
    id: "actions",
  },
];

const toast = useToast();

const subjectsStore = useSubjectStore();

const overlay = useOverlay();
const createSubjectModal = overlay.create(CreateSubjectModal);
const deleteSubjectModal = overlay.create(BaseDeleteModal);
const updateSubjectModal = overlay.create(UpdateSubjectModal);

const isTableLoading = ref(false);

const subjects = ref<SubjectItem[]>([]);

const isSubjectsLoading = ref(false);

const page = ref(1);
const limit = 20;

const totalSubjectsCount = ref(0);

function updatePage(p: number) {
  page.value = p;
}

async function openUpdateSubjectModal(subject: SubjectItem) {
  const result = await updateSubjectModal.open({
    category: subject.category,
    user: subject.user,
    name: subject.name,
  });

  if (result && typeof result === "object") {
    await subjectsStore.updateSubjectById({
      id: subject.id,
      name: result.name,
      userId: result.user,
      categoryId: result.category,
    });

    if (subjectsStore.isError) {
      toast.add({
        title: "Error",
        description: subjectsStore.errorMessage,
        color: "error",
      });
    } else {
      toast.add({
        title: "Success",
        description: "Subjects updated successfully",
        color: "success",
      });

      isSubjectsLoading.value = true;
      page.value = 1;

      getSubjects();
    }
  }
}

async function openDeleteSubjectModal(subject: SubjectItem) {
  const result = await deleteSubjectModal.open({
    title: "Delete subject " + subject.name,
    description: "Do you really want delete " + subject.name + " ?",
  });

  if (result) {
    await subjectsStore.deleteSubjectByCategoryIdAndSubjectId(
      subject.id,
      subject.categoryId,
    );

    if (subjectsStore.isError) {
      toast.add({
        title: "Error",
        description: subjectsStore.errorMessage,
      });
    } else {
      toast.add({
        title: "Success",
        description: "Subject deleted successfully",
        color: "success"
      });

      isSubjectsLoading.value = true;
      page.value = 1;

      await getSubjects();

      isSubjectsLoading.value = false;
    }
  }
}

async function openCreateSubjectModal() {
  const result = await createSubjectModal.open();

  if (result && typeof result === "object") {
    await subjectsStore.saveSubject({
      name: result.name,
      categoryId: result.category,
    });

    if (subjectsStore.isError) {
      toast.add({
        title: "Error",
        description: subjectsStore.errorMessage,
      });
    } else {
      toast.add({
        title: "Subject saved successfully",
        color: "success"
      });

      isSubjectsLoading.value = true;
      page.value = 1;

      await getSubjects();

      isSubjectsLoading.value = false;
    }
  }
}

async function getSubjects() {
  isTableLoading.value = true;
  const response = await subjectsStore.getSubjects(page.value, limit);

  if (response && response.data) {
    subjects.value = response.data;
    totalSubjectsCount.value = response.count;
  }
  isTableLoading.value = false;
}

watch(page, () => {
  if (!isSubjectsLoading.value) {
    getSubjects();
  }
});

onMounted(() => {
  getSubjects();
});
</script>
