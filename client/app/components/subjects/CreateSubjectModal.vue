<template>
  <UModal v-model:open="isModalOpen" title="Create your own subject">
    <template #body>
      <UForm
        :schema="formSchema"
        :state="formState"
        @submit.prevent="createSubject"
      >
        <UFormField name="categoryId" label="Category">
          <PaginationCategoriesSelect
            name="categoryId"
            v-model="formState.categoryId"
          />
        </UFormField>
        <UFormField name="name" label="Subject name" class="w-full mt-5">
          <UInput
            placeholder="Subject name"
            name="name"
            class="w-full"
            v-model="formState.name"
          />
        </UFormField>

        <div class="mt-10 ml-auto w-max">
          <UButton
            label="Create subject"
            type="submit"
            class="cursor-pointer"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
<script setup lang="ts">
import { z } from "zod";
import PaginationCategoriesSelect from "./PaginationCategoriesSelect.vue";
import { useCategoriesStore } from "~/store/categories/categories.store.ts";

const emit = defineEmits(["createdNew"]);

const toast = useToast();

const categoriesStore = useCategoriesStore();

const isModalOpen = defineModel<boolean>("isModalOpen", {
  default: false,
  type: Boolean,
});

const formSchema = z.object({
  categoryId: z.number(),
  name: z.string().min(1).max(500),
});

const formState = ref({
  categoryId: -1,
  name: "",
});

async function createSubject() {
  await categoriesStore.createSubject(formState.value);

  if (categoriesStore.isError) {
    toast.add({
      title: "Error",
      description: categoriesStore.errorMessage,
      progress: {
        color: "error",
      },
    });
  } else {
    toast.add({
      title: "Success",
      description: "Subject created success",
      progress: {
        color: "success",
      },
    });
    emit("createdNew");

    isModalOpen.value = false;
  }
}
</script>
