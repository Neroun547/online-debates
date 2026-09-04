<template>
  <UModal title="Update category">
    <template #body>
      <UForm @submit="saveChanges">
        <UFormField class="w-full" label="Name">
          <UInput v-model="nameState" placeholder="Name:" class="w-full" />
        </UFormField>
        <UFormField class="w-full mt-5" label="Priority">
          <UInputNumber v-model="priorityState" class="w-full" :min="1" />
        </UFormField>

        <div class="mt-5">
          <h2>Subjects:</h2>
          <div>
            <div v-for="subject in props.subjects" class="mt-3 flex w-full justify-between">
              <div>
                {{ subject.name }}
              </div>
              <div>
                <UButton icon="lucide:trash-2" size="xs" color="error" class="cursor-pointer" @click="openConfirmDeleteModal(subject)" />
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end">
          <div class="flex mt-5">
            <UButton
              label="Cancel"
              class="block mr-5 cursor-pointer"
              color="error"
              @click="emit('close', false)"
            />
            <UButton
              label="Update"
              type="submit"
              class="block cursor-pointer"
            />
          </div>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
<script setup lang="ts">
import type { SubjectItem } from "~/store/categories/interfaces/get-categories-response.interface";
import BaseDeleteModal from "../BaseDeleteModal.vue";
import { ActionType } from "./enums/action-type.enum.ts";

interface Props {
  name: string;
  priority: number;
  subjects: SubjectItem[];
}

const overlay = useOverlay();
const confirmDeleteModal = overlay.create(BaseDeleteModal);

const props = defineProps<Props>();
const nameState = ref("");
const priorityState = ref<number>();

const emit = defineEmits(["close"]);

function saveChanges(event: Event) {
  event.preventDefault();

  emit("close", {
    type: ActionType.update,
    name: nameState.value,
    priority: priorityState.value,
  });
}

async function openConfirmDeleteModal(subject: SubjectItem) {
    const result = await confirmDeleteModal.open({
        title: "Delete subject",
        description: "Do you want delete " + subject.name + " subject ?"
    });

    if(result) {
        emit("close", {
            type: ActionType.delete,
            id: subject.id,
            categoryId: subject.categoryId
        });
    }
}

watch(
  props,
  () => {
    nameState.value = props.name;
    priorityState.value = props.priority;
  },
  { immediate: true },
);
</script>
