<template>
  <div class="mt-15">
    <CreateSingleSlotModal
      v-model:is-modal-open="isCreateSingleSlotModalOpen"
      :is-save-single-slot-loading="isSaveSingleSlotButtonLoading"
      @save="
        (data: { date: CalendarDate; timeFrom: Time; timeTo: Time }) =>
          saveSingleSlot(data)
      "
    />
    <DeleteSingleSlotModal
      v-model:is-modal-open="isDeleteSingleSlotModalOpen"
      :start-time="activeDeleteSingleSlot?.startTime"
      :end-time="activeDeleteSingleSlot?.endTime"
      @confirm="deleteSingleSlot"
    />
    <h2 class="text-4xl max-md:text-2xl">{{ $t("userSlots.title") }}</h2>
    <div class="max-w-[300px]">
      <div class="mt-5">
        <label class="max-sm:text-xs">{{ $t("userSlots.category") }}</label>
        <PaginationCategoriesSelect v-model="selectedCategoryId" class="mt-2" />

        <div class="text-red-600 mt-2" v-if="isCategoryValidationError">
          {{ categoryValidationErrorMessage }}
        </div>
      </div>

      <div
        class="mt-4"
        v-if="selectedCategoryId !== -1 && selectedCategoryId !== undefined"
      >
        <label class="max-sm:text-xs">{{ $t("userSlots.subject") }}</label>
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
    <div :class="[isSlotsBlockDisabled ? 'blur-sm' : '']">
      <div class="mt-10">
        <div class="border rounded border-gray-300 shadow">
          <div v-for="slot in slots" class="p-5 border-b-gray-300 border-b">
            <div class="flex">
              <UCheckbox
                :disabled="isSlotsBlockDisabled"
                v-model="slot.enabled"
                @change="onEnableSlot(slot.weekday)"
              />
              <div class="ml-2">
                <h2 class="max-md:text-sm">{{ weekDaysMap.get(slot.weekday) }}</h2>
              </div>
            </div>
            <div v-if="slot.enabled">
              <div class="w-max ml-auto">
                <UButton
                  icon="lucide:plus"
                  size="xs"
                  class="cursor-pointer max-md:mt-5"
                  :label="$t('userSlots.addSlot')"
                  @click="addTimeToSlot(slot.weekday)"
                />
              </div>
              <div v-for="time in slot.intervals">
                <div class="mt-5 flex items-center max-md:text-xs max-md:flex-col max-md:items-start">
                  <label>{{ $t("userSlots.from") }}</label>
                  <UInputTime
                    :hour-cycle="24"
                    v-model="time.timeFrom"
                    class="ml-2 max-md:text-xs max-md:mt-2"
                  />
                  <label class="ml-10 max-md:ml-0 max-md:mt-5">{{ $t("userSlots.to") }}</label>
                  <UInputTime
                    :hour-cycle="24"
                    v-model="time.timeTo"
                    class="ml-2 max-md:text-xs max-md:mt-2"
                  />
                  <div class="ml-5 mt-1 max-md:ml-auto">
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
          <div class="ml-auto m-5 w-max">
            <UButton
              :label="$t('userSlots.saveSchedule')"
              @click="saveRegularSlots"
              class="cursor-pointer max-sm:text-xs"
              icon="lucide:import"
              :disabled="isSaveRegularSlotsButtonDisabled"
              :loading="isSaveTemplateButtonLoading"
            />
          </div>
        </div>
      </div>
      <div class="mt-10 border rounded border-gray-300 shadow p-5">
        <div>
          <h2 class="text-2xl max-md:text-xl">{{ $t("userSlots.singleSlots") }}</h2>
        </div>
        <div class="w-min ml-auto">
          <UButton
            icon="lucide:plus"
            :label="$t('userSlots.createSingleSlot')"
            class="cursor-pointer max-md:mt-5 max-md:text-xs"
            :disabled="isSaveSingleSlotButtonDisabled"
            @click="openCreateSingleSlotModal"
          />
        </div>
        <div>
          <div class="flex mt-5 max-md:justify-between max-[426px]:flex-col max-[426px]:mt-10">
            <div class="max-md:text-sm max-sm:text-xs max-[426px]:text-sm!">
              <label for="" >{{ $t("userSlots.dateFrom") }}</label>
              <input type="date" class="ml-2" v-model="singleSlotsDateFrom" />
            </div>

            <div class="ml-20 max-md:ml-0 max-sm:text-xs max-md:text-sm max-[426px]:text-sm! max-[426px]:mt-2">
              <label for="">{{ $t("userSlots.dateTo") }}</label>
              <input type="date" class="ml-2" v-model="singleSlotsDateTo" />
            </div>
          </div>
          <div
            class="mt-10 max-h-[500px] overflow-y-auto"
            ref="singleSlotsScrollContainer"
          >
            <UTable
              :columns="singleSlotsTableColumns"
              :data="singleSlots"
              ref="singleSlotsTable"
              :loading="isSingleSlotsTableLoading"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useAppStore } from "~/store/app-store";
import { CalendarDate, Time } from "@internationalized/date";
import PaginationSubjectSelect from "~/components/subjects/PaginationSubjectSelect.vue";
import PaginationCategoriesSelect from "~/components/subjects/PaginationCategoriesSelect.vue";
import { useSlotsStore } from "~/store/slots/slots.store";
import type { SlotItemInTemplateDto } from "~/store/slots/interfaces/create-slots-templates-request.interface";
import CreateSingleSlotModal from "~/components/slots/CreateSingleSlotModal.vue";
import { DateTime } from "luxon";
import type { GetSingleSlotsResponseDataItemInterface } from "~/store/slots/interfaces/get-single-slots-response.interface";
import type { TableColumn } from "@nuxt/ui";
import DeleteSingleSlotModal from "~/components/slots/DeleteSingleSlotModal.vue";
import { useInfiniteScroll } from "@vueuse/core";

const { t, locale } = useI18n();

const UButton = resolveComponent("UButton");

const slotsStore = useSlotsStore();
const weekDaysMap = computed(
  () =>
    new Map<number, string>([
      [1, t("userSlots.monday")],
      [2, t("userSlots.tuesday")],
      [3, t("userSlots.wednesday")],
      [4, t("userSlots.thursday")],
      [5, t("userSlots.friday")],
      [6, t("userSlots.saturday")],
      [7, t("userSlots.sunday")],
    ]),
);

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
const isSaveSingleSlotButtonDisabled = ref<boolean>(true);

const isSlotsBlockDisabled = computed(() => {
  return selectedCategoryId.value === null || selectedSubjectId.value === null;
});

const isCreateSingleSlotModalOpen = ref(false);
const isSaveSingleSlotButtonLoading = ref(false);
const isDeleteSingleSlotModalOpen = ref(false);
const activeDeleteSingleSlot = ref<GetSingleSlotsResponseDataItemInterface>();

const singleSlotsDateFrom = ref();
const singleSlotsDateTo = ref();
const singleSlotsPage = ref(1);
const singleSlotsLimit = ref(20);

const singleSlotsTableColumns = computed<
  TableColumn<GetSingleSlotsResponseDataItemInterface>[]
>(() => [
  {
    accessorKey: "startTime",
    header: t("userSlots.dateFrom"),
    meta: {
      class: {
        td: "max-md:text-xs",
        th: "max-md:text-xs"
      }
    }
  },
  {
    accessorKey: "endTime",
    header: t("userSlots.dateTo"),
    meta: {
      class: {
        td: "max-md:text-xs",
        th: "max-md:text-xs"
      }
    }
  },
  {
    id: "actions",
    meta: {
      class: {
        td: "text-right",
      },
    },
    cell: ({ row }) => {
      return h(UButton, {
        icon: "i-lucide-trash-2",
        color: "",
        class: "bg-red-600 text-white cursor-pointer",
        variant: "ghost",
        size: "xs",
        "aria-label": t("userSlots.deleteSingleSlot"),
        onClick: () => {
          openDeleteSingleSlotModal(row.original);
        },
      });
    },
  },
]);

const singleSlotsScrollContainer = useTemplateRef("singleSlotsScrollContainer");
const singleSlots = ref<GetSingleSlotsResponseDataItemInterface[]>([]);
const singleSlotsCount = ref<number>();
const isSingleSlotsTableLoading = ref<boolean>(false);
const isSingleSlotsLoadMoreAvailable = ref<boolean>(false);

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

function openCreateSingleSlotModal() {
  isCreateSingleSlotModalOpen.value = true;
}

function openDeleteSingleSlotModal(
  slot: GetSingleSlotsResponseDataItemInterface,
) {
  activeDeleteSingleSlot.value = slot;
  isDeleteSingleSlotModalOpen.value = true;
}

async function deleteSingleSlot() {
  if (activeDeleteSingleSlot.value) {
    await slotsStore.deleteSingleSlot(activeDeleteSingleSlot.value.id);

    if (slotsStore.isError) {
      toast.add({
        title: t("userSlots.error"),
        description: slotsStore.errorMessage,
        progress: {
          color: "error",
        },
      });
    } else {
      toast.add({
        title: t("userSlots.success"),
        description: t("userSlots.deletedSuccessfully"),
        progress: {
          color: "success",
        },
      });
    }
    getSingleSlots(true);
  }
  isDeleteSingleSlotModalOpen.value = false;
}

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
    categoryValidationErrorMessage.value = t("userSlots.categoryRequired");
    isCategoryValidationError.value = true;
  } else {
    isCategoryValidationError.value = false;
  }
  if (
    selectedSubjectId.value === -1 ||
    selectedSubjectId.value === undefined ||
    selectedSubjectId.value === null
  ) {
    subjectValidationErrorMessage.value = t("userSlots.subjectRequired");
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
        slot.errorMessage = t("userSlots.timeFromAfterTimeTo", {
          from: time.timeFrom.toString().substring(0, 5),
          to: time.timeTo.toString().substring(0, 5),
        });

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
        slot.errorMessage = t("userSlots.timeConflict", {
          from: time.timeFrom.toString().substring(0, 5),
          to: time.timeTo.toString().substring(0, 5),
          conflictFrom: conflictSlot.timeFrom.toString().substring(0, 5),
          conflictTo: conflictSlot.timeTo.toString().substring(0, 5),
        });
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
        title: t("userSlots.error"),
        description: slotsStore.errorMessage,
        progress: {
          color: "error",
        },
      });
    } else {
      toast.add({
        title: t("userSlots.success"),
        description: t("userSlots.scheduleSavedSuccessfully"),
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

function setInitialValueToSlots() {
  slots.value = [
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
  ];

  singleSlots.value = [];
}

async function saveSingleSlot(data: {
  timeTo: Time;
  timeFrom: Time;
  date: CalendarDate;
}) {
  if (selectedSubjectId.value) {
    isSaveSingleSlotButtonLoading.value = true;

    await slotsStore.createSingleSlot({
      subjectId: selectedSubjectId.value,
      startTime:
        data.date.toString() + " " + data.timeFrom.toString().substring(0, 5),
      endTime:
        data.date.toString() + " " + data.timeTo.toString().substring(0, 5),
    });

    if (slotsStore.isError) {
      toast.add({
        title: t("userSlots.error"),
        description: slotsStore.errorMessage,
        progress: {
          color: "error",
        },
      });
    } else {
      toast.add({
        title: t("userSlots.success"),
        description: t("userSlots.slotCreatedSuccessfully"),
        progress: {
          color: "success",
        },
      });
      getSingleSlots(true);
      isCreateSingleSlotModalOpen.value = false;
    }
    isSaveSingleSlotButtonLoading.value = false;
  }
}

async function getSingleSlotsCount() {
  if (selectedSubjectId.value) {
    const count = await slotsStore.getSingleSlotsCount({
      subjectId: selectedSubjectId.value,
      dateFrom: singleSlotsDateFrom.value,
      dateTo: singleSlotsDateTo.value,
    });

    if (typeof count === "number") {
      singleSlotsCount.value = count;
    }
  }
}

async function getSingleSlots(reload?: boolean) {
  if (selectedSubjectId.value) {
    isSingleSlotsTableLoading.value = true;

    const response = await slotsStore.getSingleSlots(
      selectedSubjectId.value,
      singleSlotsDateFrom.value,
      singleSlotsDateTo.value,
      singleSlotsPage.value,
      singleSlotsLimit.value,
    );
    if (response) {
      if (!reload) {
        singleSlots.value.push(...response.data);
      } else {
        singleSlots.value = response.data;
      }
      isSingleSlotsLoadMoreAvailable.value = response.isLoadMoreAvailable;
    }
    isSingleSlotsTableLoading.value = false;
  }
}

function clearSingleSlotsState() {
  singleSlotsPage.value = 1;
  isSingleSlotsLoadMoreAvailable.value = false;
  singleSlotsCount.value = 0;
  singleSlots.value = [];
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
  if (selectedSubjectId.value && selectedCategoryId.value) {
    isSaveSingleSlotButtonDisabled.value = false;
  } else {
    isSaveSingleSlotButtonDisabled.value = true;
  }
  setInitialValueToSlots();
  validateCategoryAndSubject();
});

watch(selectedSubjectId, () => {
  if (selectedSubjectId.value && selectedCategoryId.value) {
    isSaveSingleSlotButtonDisabled.value = false;
  } else {
    isSaveSingleSlotButtonDisabled.value = true;
  }
  setInitialValueToSlots();
  validateCategoryAndSubject();
  getTemplateSlots();
  getSingleSlotsCount().then(() => {
    getSingleSlots(true);
  });
});

watch(singleSlotsDateFrom, () => {
  clearSingleSlotsState();
  getSingleSlotsCount().then(() => {
    getSingleSlots(true);
  });
});

watch(singleSlotsDateTo, () => {
  clearSingleSlotsState();

  getSingleSlotsCount().then(() => {
    getSingleSlots(true);
  });
});

onMounted(() => {
  appStore.setIsLoading(false);

  const now = new Date();

  singleSlotsDateFrom.value = DateTime.fromJSDate(now).toFormat("yyyy-MM-dd");
  singleSlotsDateTo.value = DateTime.fromJSDate(now)
    .plus({ days: 7 })
    .toFormat("yyyy-MM-dd");

  useInfiniteScroll(
    singleSlotsScrollContainer,
    async () => {
      singleSlotsPage.value += 1;
      await getSingleSlots();
    },
    {
      distance: 0,
      canLoadMore: () => {
        return (
          !isSingleSlotsTableLoading.value &&
          isSingleSlotsLoadMoreAvailable.value
        );
      },
    },
  );
});
</script>
