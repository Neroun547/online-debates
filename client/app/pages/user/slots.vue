<template>
  <div class="mt-15">
    <h2 class="text-4xl">My slots</h2>
    <div class="max-w-[300px]">
      <div class="mt-5">
        <label>Category</label>
        <PaginationCategoriesSelect v-model="selectedCategoryId" class="mt-2" />

        <div class="text-red-600 mt-2" v-if="isCategoryValidationError">
          {{ categoryValidationErrorMessage }}
        </div>
      </div>

      <div
        class="mt-4"
        v-if="selectedCategoryId !== -1 && selectedCategoryId !== undefined"
      >
        <label>Subject</label>
        <PaginationSubjectSelect
          v-model="selectedSubjectId"
          :category-id="selectedCategoryId ?? undefined"
          class="mt-2"
        />
        <div class="text-red-600 mt-2" v-if="isSubjectValidationError">
          {{ subjectValidationErrorMessage }}
        </div>
      </div>
    </div>
    <div class="mt-10">
      <div class="border rounded border-gray-300 shadow">
        <div v-for="slot in slots" class="p-5 border-b-gray-300 border-b">
          <div class="flex">
            <UCheckbox
              v-model="slot.enabled"
              @change="onEnableSlot(slot.weekday)"
            />
            <div class="ml-2">
              <h2>{{ weekDaysMap.get(slot.weekday) }}</h2>
            </div>
          </div>
          <div v-if="slot.enabled">
            <div class="w-max ml-auto">
              <UButton
                icon="lucide:plus"
                size="xs"
                class="cursor-pointer"
                @click="addTimeToSlot(slot.weekday)"
              />
            </div>
            <div v-for="time in slot.intervals">
              <div class="mt-5 flex items-center">
                <label>From</label>
                <UInputTime
                  :hour-cycle="24"
                  v-model="time.timeFrom"
                  class="ml-2"
                />
                <label class="ml-10">To</label>
                <UInputTime
                  :hour-cycle="24"
                  v-model="time.timeTo"
                  class="ml-2"
                />
                <div class="ml-5 mt-1">
                  <UButton
                    icon="lucide:trash-2"
                    size="xs"
                    class="bg-red-600 active:bg-red-600 cursor-pointer hover:bg-red-600"
                    @click="deleteTimeFromSlot(slot.weekday, time.id)"
                  />
                </div>
              </div>
            </div>
            <div v-if="slot.isError" class="text-red-600 text-sm mt-5">
              {{ slot.errorMessage }}
            </div>
          </div>
        </div>
      </div>
      <div class="w-max ml-auto mt-5">
        <UButton
          label="Save schedule"
          @click="saveRegularSlots"
          class="cursor-pointer"
          icon="lucide:import"
          :disabled="isSaveRegularSlotsButtonDisabled"
          :loading="isSaveTemplateButtonLoading"
        />
      </div>
    </div>
    <div class="mt-10">
      <div>
        <h2 class="text-2xl">Single slots</h2>
      </div>
      <div class="w-min ml-auto">
        <UButton
          icon="lucide:plus"
          label="Create single slot"
          class="cursor-pointer"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useAppStore } from "~/store/app-store";
import { Time } from "@internationalized/date";
import PaginationSubjectSelect from "~/components/subjects/PaginationSubjectSelect.vue";
import PaginationCategoriesSelect from "~/components/subjects/PaginationCategoriesSelect.vue";
import { useSlotsStore } from "~/store/slots/slots.store";
import type { SlotItemInTemplateDto } from "~/store/slots/interfaces/create-slots-templates-request.interface";

const slotsStore = useSlotsStore();

const weekDaysMap = new Map();

weekDaysMap.set(1, "Monday");
weekDaysMap.set(2, "Tuesday");
weekDaysMap.set(3, "Wednesday");
weekDaysMap.set(4, "Thursday");
weekDaysMap.set(5, "Friday");
weekDaysMap.set(6, "Saturday");
weekDaysMap.set(7, "Sunday");

export interface SlotItem {
  weekday: number; // 1-7 monday-sunday
  intervals: Array<{
    id: number;
    timeFrom: any;
    timeTo: any;
  }>;
  enabled: boolean;
  isError: boolean;
  errorMessage: string;
}

const isSaveTemplateButtonLoading = ref(false);

const toast = useToast();

const appStore = useAppStore();

const selectedCategoryId = ref<number | null>(null);
const selectedSubjectId = ref<number | null>(null);

const isCategoryValidationError = ref<boolean>(false);
const categoryValidationErrorMessage = ref<string>("");

const isSubjectValidationError = ref<boolean>(false);
const subjectValidationErrorMessage = ref<string>("");

const isSaveRegularSlotsButtonDisabled = ref<boolean>(true);

const slots = ref<SlotItem[]>([
  {
    weekday: 1,
    intervals: [
      {
        id: 1,
        timeFrom: new Time(10, 0, 0),
        timeTo: new Time(12, 0, 0),
      },
    ],
    enabled: false,
    errorMessage: "",
    isError: false,
  },
  {
    weekday: 2,
    intervals: [
      {
        id: 2,
        timeFrom: new Time(10, 0, 0),
        timeTo: new Time(12, 0, 0),
      },
    ],
    enabled: false,
    errorMessage: "",
    isError: false,
  },
  {
    weekday: 3,
    intervals: [
      {
        id: 3,
        timeFrom: new Time(10, 0, 0),
        timeTo: new Time(12, 0, 0),
      },
    ],
    enabled: false,
    errorMessage: "",
    isError: false,
  },
  {
    weekday: 4,
    intervals: [
      {
        id: 4,
        timeFrom: new Time(10, 0, 0),
        timeTo: new Time(12, 0, 0),
      },
    ],
    enabled: false,
    errorMessage: "",
    isError: false,
  },
  {
    weekday: 5,
    intervals: [
      {
        id: 5,
        timeFrom: new Time(10, 0, 0),
        timeTo: new Time(12, 0, 0),
      },
    ],
    enabled: false,
    errorMessage: "",
    isError: false,
  },
  {
    weekday: 6,
    intervals: [
      {
        id: 6,
        timeFrom: new Time(10, 0, 0),
        timeTo: new Time(12, 0, 0),
      },
    ],
    enabled: false,
    errorMessage: "",
    isError: false,
  },
  {
    weekday: 7,
    intervals: [
      {
        id: 7,
        timeFrom: new Time(10, 0, 0),
        timeTo: new Time(12, 0, 0),
      },
    ],
    enabled: false,
    errorMessage: "",
    isError: false,
  },
]);

function deleteTimeFromSlot(weekday: number, timeId: number) {
  const slot = slots.value[weekday - 1];

  if (slot?.intervals) {
    slot.intervals = slot.intervals.filter((time) => time.id !== timeId);

    if (slot.intervals.length === 0) {
      slot.enabled = false;
    }
  }
}

function addTimeToSlot(weekday: number) {
  slots.value[weekday - 1]?.intervals.push({
    id: Date.now(),
    timeFrom: new Time(10, 0, 0),
    timeTo: new Time(12, 0, 0),
  });
}

function validateCategoryAndSubject(): boolean {
  if (
    selectedCategoryId.value === -1 ||
    selectedCategoryId.value === undefined ||
    selectedCategoryId.value === null
  ) {
    categoryValidationErrorMessage.value = "Category is required.";
    isCategoryValidationError.value = true;
  } else {
    isCategoryValidationError.value = false;
  }
  if (
    selectedSubjectId.value === -1 ||
    selectedSubjectId.value === undefined ||
    selectedSubjectId.value === null
  ) {
    subjectValidationErrorMessage.value = "\nSubject is required.";
    isSubjectValidationError.value = true;
  } else {
    isSubjectValidationError.value = false;
  }
  return !isSubjectValidationError.value && !isCategoryValidationError.value;
}

function validateSlots(): boolean {
  let isTimeSlotsExists = false;

  for (const slot of slots.value) {
    if (slot.intervals.length && slot.enabled) {
      isTimeSlotsExists = true;

      break;
    }
  }
  if (!isTimeSlotsExists) {
    isSaveRegularSlotsButtonDisabled.value = true;

    return false;
  }
  for (const slot of slots.value) {
    for (const time of slot.intervals) {
      const timeFromInSeconds = getTimeInSeconds(time.timeFrom.toString());
      const timeToInSeconds = getTimeInSeconds(time.timeTo.toString());

      if (timeFromInSeconds > timeToInSeconds) {
        slot.isError = true;
        slot.errorMessage = `Time from cannot be greater than time to. (${time.timeFrom.toString().substring(0, 5)} ${time.timeTo.toString().substring(0, 5)})`;

        return false;
      }
      const conflictSlot = slot.intervals.find((item) => {
        const currentTimeFromInSeconds = getTimeInSeconds(
          item.timeFrom.toString(),
        );
        const currentTimeToInSeconds = getTimeInSeconds(item.timeTo.toString());

        if (
          item.id !== time.id &&
          ((timeFromInSeconds >= currentTimeFromInSeconds &&
            timeToInSeconds <= currentTimeToInSeconds) ||
            (timeFromInSeconds <= currentTimeToInSeconds &&
              timeToInSeconds >= currentTimeFromInSeconds) ||
            (timeFromInSeconds <= currentTimeFromInSeconds &&
              timeToInSeconds >= currentTimeToInSeconds) ||
            (timeFromInSeconds >= currentTimeFromInSeconds &&
              timeToInSeconds >= currentTimeToInSeconds &&
              timeFromInSeconds <= currentTimeToInSeconds))
        ) {
          return item;
        }
        if (
          item.id !== time.id &&
          currentTimeFromInSeconds >= timeFromInSeconds &&
          currentTimeToInSeconds <= timeToInSeconds
        ) {
          return item;
        }
      });

      if (conflictSlot) {
        slot.isError = true;
        slot.errorMessage = `Time Conflict. (${time.timeFrom.toString().substring(0, 5)} ${time.timeTo.toString().substring(0, 5)} and (${conflictSlot.timeFrom.toString().substring(0, 5)} ${conflictSlot.timeTo.toString().substring(0, 5)})`;
        isSaveRegularSlotsButtonDisabled.value = true;
        return false;
      }
      slot.isError = false;
      slot.errorMessage = "";
    }
  }
  isSaveRegularSlotsButtonDisabled.value = false;
  return true;
}

function getTimeInSeconds(time: string) {
  const arr = time.substring(0, 5).split(":");

  return Number(arr[0]) * 60 * 60 + Number(arr[1]) * 60;
}

function onEnableSlot(weekday: number) {
  const slot = slots.value[weekday - 1];

  if (slot && !slot.intervals.length) {
    slot.intervals.push({
      id: Date.now(),
      timeFrom: new Time(10, 0, 0),
      timeTo: new Time(12, 0, 0),
    });
  }
}

async function saveRegularSlots() {
  const isValid = validateSlots() && validateCategoryAndSubject();

  if (isValid && selectedCategoryId.value && selectedSubjectId.value) {
    isSaveTemplateButtonLoading.value = true;
    const parsedSlots: Array<SlotItemInTemplateDto> = [];

    for (const slot of slots.value) {
      if (slot.enabled) {
        for (const time of slot.intervals) {
          parsedSlots.push({
            weekday: slot.weekday,
            startTime: time.timeFrom.toString().substring(0, 5),
            endTime: time.timeTo.toString().substring(0, 5),
          });
        }
      }
    }
    await slotsStore.saveSlotsTemplates({
      slots: parsedSlots,
      subjectId: selectedSubjectId.value,
      categoryId: selectedCategoryId.value,
    });

    if (slotsStore.isError) {
      toast.add({
        title: "Error",
        description: slotsStore.errorMessage,
        progress: {
          color: "error",
        },
      });
    } else {
      toast.add({
        title: "Success",
        description: "Schedule saved successfully",
        progress: {
          color: "success",
        },
      });
    }
    isSaveTemplateButtonLoading.value = false;
  }
}

async function getTemplateSlots() {
  if (selectedSubjectId.value) {
    const response = await slotsStore.getTimeSlots(selectedSubjectId.value);

    if (response && response.length) {
      slots.value = slots.value.map((slot) => {
        const currentSlotInResponse = response.find(
          (item) => item.weekday === slot.weekday,
        );

        if (currentSlotInResponse) {
          return {
            ...currentSlotInResponse,
          };
        }
        return slot;
      });
    }
  }
}

function mapToWatcher(slots: Array<SlotItem>) {
  return slots.map((item) => ({
    weekday: item.weekday,
    intervals: item.intervals,
    enabled: item.enabled,
  }));
}
// Map to watcher. Because isError and errorMessage prop make recursion ...
watch(
  () => mapToWatcher(slots.value),
  () => {
    validateSlots();
  },
  { deep: true },
);

watch(selectedCategoryId, () => {
  validateCategoryAndSubject();
});

watch(selectedSubjectId, () => {
  validateCategoryAndSubject();
  getTemplateSlots();
});

onMounted(() => {
  appStore.setIsLoading(false);
});
</script>
