<template>
  <UModal v-model:open="isModalOpen" title="Create single slot">
    <template #body>
      <div class="w-max ml-auto mt-5 flex max-sm:flex-col">
        <div class="max-sm:flex max-sm:justify-between">
          <label for="" class="mr-2">Time From</label>
          <UInputTime
            v-model="timeFrom"
            :hour-cycle="24"
            required
            class="mr-5 max-sm:mr-0"
          />
        </div>

        <div class="max-sm:mt-5 max-sm:flex max-sm:justify-between">
          <label for="" class="mr-2">Time to</label>
          <UInputTime v-model="timeTo" :hour-cycle="24" required />
        </div>
      </div>
      <UCalendar
        class="mt-5"
        required
        v-model="date"
        :min-value="
          new CalendarDate(now.getFullYear(), now.getMonth() + 1, now.getDate())
        "
      />
    </template>
    <template #footer>
      <div class="block w-max ml-auto">
        <UButton
          label="Save"
          @click="save"
          class="cursor-pointer"
          :loading="props.isSaveSingleSlotLoading"
        />
      </div>
    </template>
  </UModal>
</template>
<script setup lang="ts">
import { CalendarDate, Time } from "@internationalized/date";

interface Props {
  isSaveSingleSlotLoading: boolean;
}

const props = defineProps<Props>();

const now = new Date();

const isModalOpen = defineModel<boolean>("isModalOpen");

const emit = defineEmits(["save"]);

const date = shallowRef(
  new CalendarDate(now.getFullYear(), now.getMonth() + 1, now.getDate()),
);
const timeFrom = shallowRef(new Time(10, 0, 0));
const timeTo = shallowRef(new Time(12, 0, 0));

async function save() {
  emit("save", { date: date.value, timeFrom: timeFrom.value, timeTo: timeTo.value });
}
</script>
