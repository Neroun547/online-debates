<template>
  <BaseDeleteModal
    confirm-button-text="Delete subject"
    title="Delete subject"
    :content="`Are you sure you want to delete your subject (${activeDeleteSubject?.name})?`"
    v-model:is-open="isDeleteSubjectModalOpen"
    @close="isDeleteSubjectModalOpen = false"
    @confirm="deleteSubject"
  />

  <EditSubjectModal
    v-if="activeEditSubject"
    v-model:is-open="isEditSubjectModalOpen"
    :name="activeEditSubject?.name"
    :category-id="activeEditSubject?.categoryId"
    :modal-title="'Edit ' + activeEditSubject.name"
    @close="isEditSubjectModalOpen = false"
    @update="
      (newData: { name: string; categoryId: number }) => editSubject(newData)
    "
  />
  <div>
    <div
      v-for="subject in props.data"
      class="w-full flex justify-between border-gray-200 border p-2 rounded mt-5"
    >
      <div>
        {{ subject.name }}
      </div>
      <div>
        <UButton
          v-if="props.isEditButtonVisible"
          icon="lucide:pencil"
          class="ml-2 cursor-pointer"
          size="xs"
          @click="openEditSubjectModal(subject)"
        />
        <UButton
          v-if="props.isDeleteButtonVisible"
          icon="lucide:trash-2"
          class="ml-2 cursor-pointer bg-red-600 hover:bg-red-600 active:bg-red-600"
          size="xs"
          @click="openDeleteSubjectModal(subject)"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { SubjectItem } from "~/store/categories/interfaces/get-subjects-response.interface.ts";
import BaseDeleteModal from "./BaseDeleteModal.vue";
import EditSubjectModal from "./subjects/EditSubjectModal.vue";

interface Props {
  data: Array<SubjectItem>;
  categoryId?: number;
  isEditButtonVisible?: boolean;
  isDeleteButtonVisible?: boolean;
}

const activeDeleteSubject = ref<SubjectItem>();
const isDeleteSubjectModalOpen = ref<boolean>(false);

const activeEditSubject = ref<SubjectItem>();
const isEditSubjectModalOpen = ref<boolean>(false);

const emit = defineEmits(["delete", "update"]);

const props = defineProps<Props>();

function openDeleteSubjectModal(subject: SubjectItem) {
  activeDeleteSubject.value = subject;

  isDeleteSubjectModalOpen.value = true;
}

function openEditSubjectModal(subject: SubjectItem) {
  activeEditSubject.value = subject;
  isEditSubjectModalOpen.value = true;
}

function deleteSubject() {
  emit("delete", activeDeleteSubject.value);
  isDeleteSubjectModalOpen.value = false;
}

function editSubject(data: { name: string; categoryId: number }) {
  emit("update", { ...data, id: activeEditSubject.value?.id });
  isEditSubjectModalOpen.value = false;
}
</script>
