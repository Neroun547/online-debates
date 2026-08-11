<template>
  <UModal
    v-model:open="isModalOpen"
    title="Delete single slot"
    description="This action cannot be undone."
  >
    <template #body>
      <div class="flex gap-3">
        <UIcon
          name="i-lucide-triangle-alert"
          class="mt-0.5 size-5 shrink-0 text-red-600"
        />

        <div>
          <p class="text-sm text-gray-700 dark:text-gray-300">
            Are you sure you want to delete this single slot?
          </p>

          <dl
            v-if="props.startTime || props.endTime"
            class="mt-4 space-y-2 rounded-lg bg-gray-50 p-3 text-sm dark:bg-gray-800"
          >
            <div
              v-if="props.startTime"
              class="flex justify-between gap-6"
            >
              <dt class="text-gray-500 dark:text-gray-400">
                Date from
              </dt>
              <dd class="font-medium text-gray-900 dark:text-white">
                {{ props.startTime }}
              </dd>
            </div>
            <div
              v-if="props.endTime"
              class="flex justify-between gap-6"
            >
              <dt class="text-gray-500 dark:text-gray-400">
                Date to
              </dt>
              <dd class="font-medium text-gray-900 dark:text-white">
                {{ props.endTime }}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex w-full justify-end gap-3">
        <UButton
          label="Cancel"
          color="neutral"
          variant="outline"
          class="cursor-pointer"
          @click="isModalOpen = false"
        />
        <UButton
          label="Delete slot"
          icon="i-lucide-trash-2"
          color="error"
          class="cursor-pointer"
          @click="emit('confirm')"
        />
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
interface Props {
  startTime?: string
  endTime?: string
}

const props = defineProps<Props>()

const isModalOpen = defineModel<boolean>('isModalOpen', {
  default: false
})

const emit = defineEmits<{
  confirm: []
}>()
</script>
