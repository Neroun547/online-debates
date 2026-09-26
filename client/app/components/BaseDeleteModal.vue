<script setup>
const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
    required: false
  },
  title: {
    type: String,
    default: "",
  },
  description: {
    type: String,
    default: "",
  },
  content: {
    type: String,
    default: "",
  },
  confirmButtonText: {
    type: String,
    default: "Delete",
  },
});

const isOpen = defineModel("isOpen", {
  type: Boolean,
  default: false,
  required: true,
});

const emit = defineEmits(["close", "confirm"]);

function cancel() {
  emit("close", false);
}

function confirm() {
  emit("confirm", true);
}
</script>

<template>
  <UModal :title="title" :description="description" v-model:open="isOpen">
    <template #body>
      <p class="text-sm text-gray-700">
        {{ content }}
      </p>
    </template>

    <template #footer>
      <div class="flex w-full justify-end gap-3">
        <UButton
          :label="$t('baseDeleteModal.cancel')"
          color="neutral"
          variant="outline"
          @click="cancel"
          class="cursor-pointer max-sm:text-xs"
        />
        <UButton
          :label="confirmButtonText"
          color="error"
          :disabled="loading"
          :loading="loading"
          @click="confirm"
          class="cursor-pointer max-sm:text-xs"
        />
      </div>
    </template>
  </UModal>
</template>
