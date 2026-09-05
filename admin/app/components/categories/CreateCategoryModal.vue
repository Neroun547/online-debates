<template>
  <UModal title="Create category">
    <template #body>
      <UForm :schema="formSchema" :state="formState" @submit="submitForm">
        <UFormField name="name" label="Name" class="w-full">
          <UInput
            v-model="formState.name"
            placeholder="Name:"
            name="name"
            class="w-full"
          />
        </UFormField>
        <UFormField name="priority" label="Priority" class="mt-5 w-full">
          <UInputNumber
            v-model="formState.priority"
            placeholder="Priority:"
            :min="1"
            name="priority"
            class="w-1/2"
          />
        </UFormField>
        <USeparator class="mt-5 mb-5" />
        <div class="flex justify-end">
          <UButton
            label="Cancel"
            color="error"
            class="mr-3 cursor-pointer"
            @click="emit('close', false)"
          />
          <UButton label="Save" type="submit" class="cursor-pointer" />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
<script setup lang="ts">
import * as zod from "zod";

const emit = defineEmits(["close"]);

function submitForm(event: Event) {
  event.preventDefault();

  emit("close", formState);
}

const formSchema = zod.object({
  name: zod.string().min(1).max(500),
  priority: zod.number().min(1),
});

const formState = reactive({
  name: "",
  priority: 1,
});
</script>
