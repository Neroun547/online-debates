<template>
  <UModal title="Create category">
    <template #body>
      <UForm :schema="formSchema" :state="formState" @submit="submitForm">
        <UFormField name="translateNameUk" label="Ukrainian" class="w-full">
          <UInput
            v-model="formState.translateNameUk"
            placeholder="Ukrainian:"
            name="name"
            class="w-full"
          />
        </UFormField>
        <UFormField name="translateNameRu" label="Russian" class="mt-5 w-full">
          <UInput
            v-model="formState.translateNameRu"
            placeholder="Russian:"
            name="name"
            class="w-full"
          />
        </UFormField>
        <UFormField name="translateNameEn" label="English" class="mt-5 w-full">
          <UInput
            v-model="formState.translateNameEn"
            placeholder="English:"
            name="name"
            class="w-full"
          />
        </UFormField>
        <UFormField name="emoji" label="Emoji" class="mt-5 w-full">
          <UInput
            v-model="formState.emoji"
            placeholder="Emoji"
            name="emoji"
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
  priority: zod.number().min(1),
  translateNameEn: zod.string().min(1).max(500),
  translateNameRu: zod.string().min(1).max(500),
  translateNameUk: zod.string().min(1).max(500),
  emoji: zod.string().max(255).optional()
});

const formState = reactive({
  priority: 1,
  translateNameEn: "",
  translateNameRu: "",
  translateNameUk: "",
  emoji: ""
});
</script>
