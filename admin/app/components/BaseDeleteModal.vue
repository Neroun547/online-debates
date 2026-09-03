<template>
  <UModal>
    <template #title>
      <h2>{{ props.title }}</h2>
    </template>
    <template #body>
      <p>{{ props.description }}</p>
    </template>
    <template #footer>
      <div class="flex justify-end w-full">
        <div>
          <UButton label="Cancel" @click="emit('close', false)" class="mr-5" />
          <UButton label="Delete" @click="emit('close', true)" color="error" />
        </div>
      </div>
    </template>
  </UModal>
</template>
<script setup lang="ts">
interface Props {
  title: string;
  description: string;
}
const props = defineProps<Props>();
const emit = defineEmits(["close"]);
</script>
