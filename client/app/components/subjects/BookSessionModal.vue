<template>
  <UModal
    v-model:open="isModalOpen"
    :title="$t('subjects.bookingModal.title')"
    :description="$t('subjects.bookingModal.description')"
    :ui="{ content: 'sm:max-w-3xl' }"
  >
    <template #body>
      <div class="grid gap-6 md:grid-cols-[auto_1fr]">
        <section>
          <div class="mb-3 flex items-center gap-2">
            <span
              class="flex size-8 items-center justify-center rounded-full bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400"
            >
              <UIcon name="i-lucide-calendar-days" class="size-4" />
            </span>
            <div>
              <p class="text-sm font-semibold text-gray-900 dark:text-white">
                {{ $t("subjects.bookingModal.selectDate") }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ $t("subjects.bookingModal.availableDatesDescription") }}
              </p>
            </div>
          </div>

          <div
            class="flex justify-center rounded-xl border border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-gray-900"
          >
            <UCalendar
              prevent-deselect
              v-model="selectedDate"
              :min-value="minDate"
              required
              @update:placeholder="updateCalendarState"
              :is-date-disabled="isDateDisabled"
            />
          </div>
        </section>

        <section
          class="flex min-w-0 flex-col md:border-l md:border-gray-200 md:pl-6 dark:md:border-gray-800"
        >
          <div class="mb-4 flex items-start justify-between gap-3">
            <div class="flex items-center gap-2">
              <span
                class="flex size-8 items-center justify-center rounded-full bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400"
              >
                <UIcon name="i-lucide-clock-3" class="size-4" />
              </span>
              <div>
                <p class="text-sm font-semibold text-gray-900 dark:text-white">
                  {{ $t("subjects.bookingModal.availableTime") }}
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  {{ formattedSelectedDate }}
                </p>
              </div>
            </div>

            <UBadge
              v-if="!isLoading && availableSlots.length"
              color="neutral"
              variant="soft"
            >
              {{
                $t("subjects.bookingModal.availableSlots", {
                  count: availableSlots.length,
                })
              }}
            </UBadge>
          </div>

          <div
            class="min-h-72 rounded-xl border border-gray-200 bg-gray-50/70 p-4 dark:border-gray-800 dark:bg-gray-900/50"
          >
            <div
              v-if="isLoading"
              class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-2"
            >
              <USkeleton
                v-for="item in 6"
                :key="item"
                class="h-10 rounded-lg"
              />
            </div>

            <div
              v-else-if="availableSlots.length"
              class="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-2"
            >
              <UButton
                v-for="slot in availableSlots"
                :key="slot.id"
                :label="getSlotLabel(slot)"
                :color="selectedSlotId === slot.id ? 'primary' : 'neutral'"
                :variant="selectedSlotId === slot.id ? 'solid' : 'outline'"
                class="w-full cursor-pointer justify-center"
                @click="selectedSlotId = slot.id"
              />
            </div>

            <div
              v-else
              class="flex min-h-60 flex-col items-center justify-center px-4 text-center"
            >
              <span
                class="mb-3 flex size-12 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500"
              >
                <UIcon name="i-lucide-calendar-x-2" class="size-6" />
              </span>
              <p class="text-sm font-medium text-gray-700 dark:text-gray-200">
                {{ $t("subjects.bookingModal.noAvailableSlots") }}
              </p>
              <p
                class="mt-1 max-w-52 text-xs leading-5 text-gray-500 dark:text-gray-400"
              >
                {{ $t("subjects.bookingModal.tryAnotherDate") }}
              </p>
            </div>
          </div>

          <div
            class="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400"
          >
            <UIcon name="i-lucide-globe-2" class="size-4 shrink-0" />
            <span>
              {{
                $t("subjects.bookingModal.timeZone", {
                  timezone: displayedTimezone,
                })
              }}
            </span>
          </div>
        </section>
      </div>
    </template>

    <template #footer>
      <div
        class="flex w-full flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between"
      >
        <p class="min-w-0 truncate text-sm text-gray-500 dark:text-gray-400">
          <template v-if="selectedSlot">
            {{ formattedSelectedDate }},
            <span class="font-medium text-gray-900 dark:text-white">
              {{ getSlotLabel(selectedSlot) }}
            </span>
          </template>
          <template v-else>
            {{ $t("subjects.bookingModal.selectTimeToContinue") }}
          </template>
        </p>

        <div class="flex shrink-0 justify-end gap-3">
          <UButton
            :label="$t('subjects.bookingModal.cancel')"
            color="neutral"
            variant="outline"
            class="cursor-pointer max-sm:text-xs"
            @click="isModalOpen = false"
          />
          <UButton
            :label="$t('subjects.bookingModal.bookSession')"
            icon="i-lucide-calendar-check-2"
            class="cursor-pointer max-sm:text-xs"
            :disabled="!selectedSlot"
            :loading="props.isBookingButtonLoading"
            @click="bookSession"
          />
        </div>
      </div>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import {
  CalendarDate,
  getLocalTimeZone,
  today,
  type DateValue,
} from "@internationalized/date";
import { DateTime } from "luxon";
import type { GetSlotsForBookingResponseInterface } from "~/store/slots/interfaces/get-slots-for-booking-response.interface";

const { t, locale } = useI18n();

interface Props {
  availableSlots?: GetSlotsForBookingResponseInterface[];
  isLoading?: boolean;
  timezone?: string;
  isBookingButtonLoading?: boolean;
  availableDates?: Array<{ date: string }>;
  defaultSelectedDate?: {
    year: number;
    month: number;
    day: number;
  };
}

const props = withDefaults(defineProps<Props>(), {
  availableSlots: () => [],
  isLoading: false,
  timezone: "",
  isBookingButtonLoading: false,
});

const calendarState = defineModel("calendarState");

const emit = defineEmits(["book", "dateChange"]);

const isModalOpen = defineModel<boolean>("isModalOpen", {
  default: false,
});

const minDate = today(getLocalTimeZone());
const selectedDate = shallowRef(minDate);
const selectedSlotId = ref<GetSlotsForBookingResponseInterface["id"]>();

const selectedSlot = computed(() => {
  return props.availableSlots.find((slot) => slot.id === selectedSlotId.value);
});

const displayedTimezone = computed(() => {
  return props.timezone || t("subjects.bookingModal.yourLocalTime");
});

const formattedSelectedDate = computed(() => {
  return new Intl.DateTimeFormat(locale.value, {
    weekday: "short",
    month: "long",
    day: "numeric",
  }).format(selectedDate.value.toDate(getLocalTimeZone()));
});

function isDateDisabled(date: DateValue) {
  if (props.availableDates) {
    const parsedDate =
      date.year +
      "-" +
      date.month +
      "-" +
      (date.day < 10 ? "0" + date.day : date.day);

    return (
      props.availableDates.findIndex(
        (availableDate: { date: string }) => availableDate.date === parsedDate,
      ) === -1
    );
  }
  return false;
}

function getSlotLabel(slot: GetSlotsForBookingResponseInterface): string {
  return `${formatSlotTime(slot.startTime)} – ${formatSlotTime(slot.endTime)}`;
}

function formatSlotTime(value: string): string {
  const dateTime = DateTime.fromSQL(value);

  return dateTime.isValid ? dateTime.toFormat("HH:mm") : value;
}

function updateCalendarState(event: DateValue) {
  calendarState.value = { month: event.month, year: event.year };
}

watch(selectedDate, (date) => {
  selectedSlotId.value = undefined;
  emit("dateChange", date.toString());
});

watch(
  isModalOpen,
  (isOpen) => {
    if (!isOpen) return;

    selectedSlotId.value = undefined;
    emit("dateChange", selectedDate.value.toString());
  },
  { immediate: true },
);

function bookSession() {
  if (!selectedSlot.value) return;

  emit("book", {
    date: selectedDate.value.toString(),
    slot: selectedSlot.value,
  });
}

watch(
  () => props.defaultSelectedDate,
  () => {
    if (props.defaultSelectedDate) {
      const parsedDate = new CalendarDate(
        props.defaultSelectedDate.year,
        props.defaultSelectedDate.month,
        props.defaultSelectedDate.day,
      );

      if (parsedDate.compare(minDate) > 0) {
        selectedDate.value = parsedDate;
      }
    }
  },
);
</script>
