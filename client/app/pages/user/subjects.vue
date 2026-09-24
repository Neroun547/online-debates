<template>
  <div class="mt-15">
    <CreateSubjectModal
      v-model:is-modal-open="isCreateSubjectModalOpen"
      @createdNew="reloadSubjects"
    />
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-4xl">{{ $t("mySubjects.title") }}</h2>
      </div>
      <div>
        <UButton
          :label="$t('mySubjects.addNewSubject')"
          icon="lucide:plus"
          class="cursor-pointer"
          @click="openCreateSubjectModal"
        />
      </div>
    </div>

    <div class="mt-10">
      <UserSubjectsList
        :data="subjects"
        :is-delete-button-visible="true"
        :is-edit-button-visible="true"
        @delete="(subject: SubjectItem) => deleteSubject(subject)"
        @update="
          (subject: { name: string; categoryId: number; id: number }) =>
            updateSubject(subject)
        "
      />

      <LoadMoreButton
        v-if="isLoadMoreAvailable"
        @load-more="incrementPage"
        :is-loading="isLoadMoreButtonLoading"
        class="m-auto block mt-15"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import UserSubjectsList from "~/components/UserSubjectsList.vue";
import LoadMoreButton from "~/components/LoadMoreButton.vue";
import CreateSubjectModal from "~/components/subjects/CreateSubjectModal.vue";
import { useAppStore } from "~/store/app-store";
import { useCategoriesStore } from "~/store/categories/categories.store";
import type { SubjectItem } from "~/store/categories/interfaces/get-subjects-response.interface";

const { t } = useI18n();

const toast = useToast();

const appStore = useAppStore();
const categoriesStore = useCategoriesStore();

const isCreateSubjectModalOpen = ref(false);
const isLoadMoreButtonLoading = ref(false);
const isLoadMoreAvailable = ref(false);

async function updateSubject(subject: {
  name: string;
  categoryId: number;
  id: number;
}) {
  await categoriesStore.updateSubject({
    name: subject.name,
    categoryId: subject.categoryId,
    id: subject.id,
  });

  reloadSubjects();

  if (categoriesStore.isError) {
    toast.add({
      title: t("mySubjects.error"),
      description: categoriesStore.errorMessage,
      progress: {
        color: "error",
      },
    });
  } else {
    toast.add({
      title: t("mySubjects.success"),
      description: t("mySubjects.updatedSuccessfully"),
      progress: {
        color: "success",
      },
    });
  }
}

async function deleteSubject(subject: SubjectItem) {
  await categoriesStore.deleteSubjectById(subject.id);

  reloadSubjects();

  if (categoriesStore.isError) {
    toast.add({
      title: t("mySubjects.error"),
      description: categoriesStore.errorMessage,
      progress: {
        color: "error",
      },
    });
  } else {
    toast.add({
      title: t("mySubjects.success"),
      description: t("mySubjects.deletedSuccessfully"),
      progress: {
        color: "success",
      },
    });
  }
}

function openCreateSubjectModal() {
  isCreateSubjectModalOpen.value = true;
}

const page = ref(1);
const limit = ref(20);

const subjects = ref<SubjectItem[]>([]);

async function loadSubjects() {
  const response = await categoriesStore.getUserSubjects({
    page: page.value,
    limit: limit.value,
  });

  if (response) {
    subjects.value.push(...response.data);
    isLoadMoreAvailable.value = response.isLoadMoreAvailable;
  }
}

function reloadSubjects() {
  appStore.setIsLoading(true);
  subjects.value = [];

  page.value = 1;

  loadSubjects().then(() => {
    appStore.setIsLoading(false);
  });
}

function incrementPage() {
  isLoadMoreButtonLoading.value = true;
  page.value += 1;

  loadSubjects().then(() => {
    isLoadMoreButtonLoading.value = false;
  });
}

onMounted(() => {
  loadSubjects().then(() => {
    appStore.setIsLoading(false);
  });
});
</script>
