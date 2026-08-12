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
  <ul class="list-disc">
    <li
      v-for="item in props.data"
      v-bind:key="item.id"
      class="text-primary text-xl text-center mt-3"
    >
      <div
        :class="[
          props.isEditButtonVisible || props.isDeleteButtonVisible
            ? 'flex justify-between'
            : 'text-center',
        ]"
      >
        <ULink
          class="text-primary cursor-pointer"
          :to="'/categories/' + categoryId + '/subjects/' + item.id"
          v-if="categoryId"
        >
          {{ item.name }}
        </ULink>
        <ULink class="text-primary cursor-pointer" v-if="!categoryId">
          {{ item.name }}
        </ULink>
        <div class="ml-10">
          <UButton
            v-if="props.isEditButtonVisible"
            icon="lucide:pencil"
            class="ml-2 cursor-pointer"
            size="xs"
            @click="openEditSubjectModal(item)"
          />
          <UButton
            v-if="props.isDeleteButtonVisible"
            icon="lucide:trash-2"
            class="ml-2 cursor-pointer bg-red-600 hover:bg-red-600 active:bg-red-600"
            size="xs"
            @click="openDeleteSubjectModal(item)"
          />
        </div>
      </div>
    </li>
  </ul>
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
