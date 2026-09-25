<template>
  <UModal title="Update category">
    <template #body>
      <UForm @submit="saveChanges" :schema="formSchema" :state="formState">
        <UFormField name="translateNameUk" label="Ukrainian" class="w-full">
          <UInput
            v-model="formState.translateNameUk"
            placeholder="Ukrainian:"
            name="translateNameUk"
            class="w-full"
          />
        </UFormField>
        <UFormField name="translateNameRu" label="Russian" class="mt-5 w-full">
          <UInput
            v-model="formState.translateNameRu"
            placeholder="Russian:"
            name="translateNameRu"
            class="w-full"
          />
        </UFormField>
        <UFormField name="translateNameEn" label="English" class="mt-5 w-full">
          <UInput
            v-model="formState.translateNameEn"
            placeholder="English:"
            name="translateNameEn"
            class="w-full"
          />
        </UFormField>
        <UFormField class="w-full mt-5" label="Priority" name="priority">
          <UInputNumber
            v-model="formState.priority"
            class="w-full"
            :min="1"
            name="priority"
          />
        </UFormField>

        <div class="mt-5">
          <h2>Subjects:</h2>
          <div>
            <div
              v-for="subject in props.subjects"
              class="mt-3 flex w-full justify-between"
            >
              <div>
                {{ subject.name }}
              </div>
              <div>
                <UButton
                  icon="lucide:trash-2"
                  size="xs"
                  color="error"
                  class="cursor-pointer"
                  @click="openConfirmDeleteModal(subject)"
                />
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
import * as zod from "zod";

interface Props {
  translateNameUk: string;
  translateNameRu: string;
  translateNameEn: string;
  priority: number;
  subjects?: SubjectItem[];
}

const overlay = useOverlay();
const confirmDeleteModal = overlay.create(BaseDeleteModal);

const props = defineProps<Props>();

const formState = reactive({
  translateNameUk: "",
  translateNameRu: "",
  translateNameEn: "",
  priority: 1,
});

const formSchema = zod.object({
  translateNameUk: zod.string().min(1).max(500),
  translateNameRu: zod.string().min(1).max(500),
  translateNameEn: zod.string().min(1).max(500),
  priority: zod.number().min(1),
});

const emit = defineEmits(["close"]);

function saveChanges(event: Event) {
  event.preventDefault();

  emit("close", {
    type: ActionType.update,
    priority: formState.priority,
    translateNameUk: formState.translateNameUk,
    translateNameRu: formState.translateNameRu,
    translateNameEn: formState.translateNameEn,
  });
}

async function openConfirmDeleteModal(subject: SubjectItem) {
  const result = await confirmDeleteModal.open({
    title: "Delete subject",
    description: "Do you want delete " + subject.name + " subject ?",
  });

  if (result) {
    emit("close", {
      type: ActionType.delete,
      id: subject.id,
      categoryId: subject.categoryId,
    });
  }
}

watch(
  props,
  () => {
    formState.translateNameEn = props.translateNameEn;
    formState.translateNameRu = props.translateNameRu;
    formState.translateNameUk = props.translateNameUk;
    formState.priority = props.priority;
  },
  { immediate: true },
);
</script>
