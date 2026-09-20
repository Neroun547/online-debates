<template>
  <UModal
    v-model:open="isModalOpen"
    :title="$t('userSlots.DeleteSingleSlotModal.title')"
    :description="$t('userSlots.DeleteSingleSlotModal.description')"
  >
    <template #body>
      <div class="flex gap-3">
        <UIcon
          name="i-lucide-triangle-alert"
          class="mt-0.5 size-5 shrink-0 text-red-600"
        />

        <div>
          <p class="text-sm text-gray-700 dark:text-gray-300">
            {{ $t("userSlots.DeleteSingleSlotModal.content") }}
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
                {{ $t("userSlots.DeleteSingleSlotModal.dateFrom") }}
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
                {{ $t("userSlots.DeleteSingleSlotModal.dateTo") }}
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
          :label="$t('userSlots.DeleteSingleSlotModal.cancel')"
          color="neutral"
          variant="outline"
          class="cursor-pointer"
          @click="isModalOpen = false"
        />
        <UButton
          :label="$t('userSlots.DeleteSingleSlotModal.deleteSlot')"
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
