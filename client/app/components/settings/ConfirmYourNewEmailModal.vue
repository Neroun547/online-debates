<script setup>
const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  }
});

const isOpen = defineModel("isOpen", {
  type: Boolean,
  default: false,
  required: true
});

const emit = defineEmits(["close"]);

function confirm() {
  emit("close");
}
</script>

<template>
  <UModal
    title="Confirm your new email address"
    v-model:open="isOpen"
  >
    <template #body>
      <p class="text-sm text-gray-700">
        Letter with confirmation link was sent to your new email.
      </p>
    </template>

    <template #footer>
      <div class="flex w-full justify-end gap-3">
        <UButton
          label="Ok"
          color="primary"
          @click="confirm"
          class="cursor-pointer"
        />
      </div>
    </template>
  </UModal>
</template>
