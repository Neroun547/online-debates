<template>
  <div class="mt-15">
    <h2 class="text-4xl">My sessions</h2>

    <div class="mt-10 flex flex-wrap items-end gap-4">
      <UFormField label="Sessions">
        <USelect
          v-model="selectedSessionFilterOption"
          :items="filtersSessionsSelectOptions"
          class="min-w-48"
          :ui="{ content: 'min-w-fit' }"
        />
      </UFormField>

      <UFormField label="Date from">
        <input
          id="sessions-date-from"
          v-model="dateFrom"
          type="date"
          :max="dateTo || undefined"
          class="h-8 rounded-md border border-default bg-default px-2.5 text-sm text-highlighted outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
      </UFormField>

      <UFormField label="Date to">
        <input
          id="sessions-date-to"
          v-model="dateTo"
          type="date"
          :min="dateFrom || undefined"
          class="h-8 rounded-md border border-default bg-default px-2.5 text-sm text-highlighted outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
      </UFormField>
    </div>

    <UAlert
      v-if="!isDateRangeValid"
      class="mt-6"
      color="error"
      variant="soft"
      title="Invalid date range"
      description="Date from cannot be later than date to."
      icon="i-lucide-calendar-x"
    />

    <UAlert
      v-else-if="isError"
      class="mt-6"
      color="error"
      variant="soft"
      title="Could not load sessions"
      :description="errorMessage"
      icon="i-lucide-circle-alert"
    >
      <template #actions>
        <UButton
          color="error"
          variant="soft"
          size="xs"
          @click="loadSessions(true)"
        >
          Try again
        </UButton>
      </template>
    </UAlert>

    <div v-if="isInitialLoading" class="mt-10 grid gap-4">
      <USkeleton v-for="item in 3" :key="item" class="h-36 rounded-xl" />
    </div>

    <div v-else-if="allSessions.length" class="mt-10 grid gap-4">
      <article
        v-for="session in allSessions"
        :key="session.id"
        class="rounded-xl border border-default bg-default p-5 shadow-sm"
      >
        <div class="flex flex-wrap items-start justify-between gap-4">
          <div class="flex min-w-0 items-start gap-3">
            <span
              class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
            >
              <UIcon name="i-lucide-calendar-clock" class="size-5" />
            </span>

            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <h3 class="font-semibold text-highlighted">
                  {{ getSessionRoleLabel(session) }}
                </h3>
                <UBadge
                  :color="getStatusColor(session.status)"
                  variant="soft"
                  class="capitalize"
                >
                  {{ session.status }}
                </UBadge>
              </div>

              <p class="mt-1 text-sm text-muted">
                With {{ getCounterpartName(session) }}
                <UBadge
                  v-if="
                    userStore.userId !== session.creatorId && session.creator
                  "
                  variant="soft"
                  :color="
                    session.creator.status === 'offline' ? 'neutral' : 'success'
                  "
                  >{{ session.creator.status }}</UBadge
                >
                <UBadge
                  v-if="
                    userStore.userId !== session.customerId && session.customer
                  "
                  variant="soft"
                  :color="
                    session.customer.status === 'offline'
                      ? 'neutral'
                      : 'success'
                  "
                  >{{ session.customer.status }}</UBadge
                >
              </p>
            </div>
          </div>

          <div v-if="session.slot" class="text-left sm:text-right">
            <p class="font-medium text-highlighted">
              {{ session.slot.startTime }}
            </p>
            <p class="mt-1 text-sm text-muted">
              {{
                formatSessionTime(session.slot.startTime, session.slot.endTime)
              }}
            </p>
          </div>
        </div>

        <div
          class="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-default pt-4 text-sm text-muted items-center"
        >
          <div class="max-w-[200px] w-full">
            <span v-if="session.slot">{{
              session.slot.subject?.category?.name
            }}</span>
            <span v-if="session.slot" class="ml-5">{{
              session.slot.subject?.name
            }}</span>
          </div>
          <div class="ml-auto">
            <UTooltip
              :text="'Start at ' + session.slot?.startTime"
              v-if="
                !isSessionStarted(session.slot?.startTime ?? '') &&
                session.status === 'booked'
              "
            >
              <UButton label="Start" class="cursor-pointer" :disabled="true" />
            </UTooltip>
            <UTooltip
              v-if="
                isSessionStarted(session.slot?.startTime ?? '') &&
                session.status === 'booked'
              "
              :text="'Start now'"
            >
              <UButton
                label="Start"
                class="cursor-pointer"
                @click="startSession(session.id)"
              />
            </UTooltip>
          </div>
        </div>
      </article>
    </div>

    <div
      v-else-if="!isError && isDateRangeValid"
      class="mt-10 rounded-xl border border-dashed border-default px-6 py-12 text-center"
    >
      <UIcon name="i-lucide-calendar-x-2" class="mx-auto size-9 text-muted" />
      <h2 class="mt-3 font-semibold text-highlighted">
        You don't have sessions
      </h2>
      <p class="mt-1 text-sm text-muted">
        Try changing the session type or date range.
      </p>
    </div>

    <div ref="loadMoreSentinel" class="h-px" aria-hidden="true" />

    <div
      v-if="isLoadingMore"
      class="flex items-center justify-center gap-2 py-8 text-sm text-muted"
    >
      <UIcon name="i-lucide-loader-circle" class="size-5 animate-spin" />
      Loading more sessions...
    </div>
  </div>
</template>

<script setup lang="ts">
import { DateTime } from "luxon";
import { storeToRefs } from "pinia";
import { userAuthGuard } from "~/guards/user-auth.guard";
import { useAppStore } from "~/store/app-store";
import type {
  SessionStatus,
  UserSessionInterface,
  UserSessionsFilter,
} from "~/store/sessions/interfaces/get-user-sessions.interface";
import { useSessionsStore } from "~/store/sessions/sessions.store";
import { useUserStore } from "~/store/user/user.store";

const router = useRouter();

const appStore = useAppStore();
const sessionsStore = useSessionsStore();
const userStore = useUserStore();
const { errorMessage, isError } = storeToRefs(sessionsStore);

const filtersSessionsSelectOptions: Array<{
  label: string;
  value: UserSessionsFilter;
}> = [
  {
    label: "Booked with me",
    value: "booked_with_me",
  },
  {
    label: "My bookings",
    value: "my_booking",
  },
  {
    label: "All",
    value: "all",
  },
];

const now = DateTime.now();
const selectedSessionFilterOption = ref<UserSessionsFilter>("all");
const dateFrom = ref(now.toFormat("yyyy-MM-dd"));
const dateTo = ref(now.plus({ weeks: 2 }).toFormat("yyyy-MM-dd"));
const allSessions = ref<UserSessionInterface[]>([]);
const loadMoreSentinel = ref<HTMLElement | null>(null);

const page = ref(0);
const limit = 10;
const hasMore = ref(true);
const isLoading = ref(false);
let requestVersion = 0;
let paginationObserver: IntersectionObserver | undefined;

const isDateRangeValid = computed(() => {
  return Boolean(
    dateFrom.value && dateTo.value && dateFrom.value <= dateTo.value,
  );
});
const isInitialLoading = computed(() => isLoading.value && page.value === 0);
const isLoadingMore = computed(() => isLoading.value && page.value > 0);

function startSession(sessionId: number) {
  // router.push("/my-sessions/" + sessionId);

  window.location.href = "/my-sessions/" + sessionId;
}

function isSessionStarted(date: string): boolean {
  return DateTime.fromFormat(date, "yyyy-MM-dd HH:mm").toMillis() <= Date.now();
}

function toApiDate(value: string, endOfDay = false): string {
  const date = DateTime.fromISO(value);
  const boundary = endOfDay ? date.endOf("day") : date.startOf("day");

  return boundary.toUTC().toISO() ?? value;
}

function sortSessions(
  sessions: UserSessionInterface[],
): UserSessionInterface[] {
  return sessions.sort((firstSession, secondSession) => {
    const firstStartTime = firstSession.slot?.startTime ?? "";
    const secondStartTime = secondSession.slot?.startTime ?? "";

    return firstStartTime.localeCompare(secondStartTime);
  });
}

async function loadSessions(reset = false) {
  if (!isDateRangeValid.value) {
    if (reset) {
      requestVersion += 1;
      allSessions.value = [];
      page.value = 0;
      hasMore.value = false;
    }

    return;
  }
  if (!reset && (isLoading.value || !hasMore.value)) {
    return;
  }

  const currentRequestVersion = reset ? ++requestVersion : requestVersion;
  const requestedPage = reset ? 1 : page.value + 1;

  if (reset) {
    allSessions.value = [];
    page.value = 0;
    hasMore.value = true;
  }
  isLoading.value = true;

  try {
    const response = await sessionsStore.getUserSessions({
      page: requestedPage,
      limit,
      dateFrom: toApiDate(dateFrom.value),
      dateTo: toApiDate(dateTo.value, true),
      status: selectedSessionFilterOption.value,
    });

    if (currentRequestVersion !== requestVersion) {
      return;
    }
    if (!response) {
      hasMore.value = false;
      return;
    }

    const existingSessionIds = new Set(
      allSessions.value.map((session) => session.id),
    );
    const newSessions = response.filter(
      (session) => !existingSessionIds.has(session.id),
    );

    allSessions.value = sortSessions([...allSessions.value, ...newSessions]);
    page.value = requestedPage;
    hasMore.value = response.length === limit;
  } finally {
    if (currentRequestVersion === requestVersion) {
      isLoading.value = false;
    }
  }

  await nextTick();
  if (hasMore.value && isSentinelVisible()) {
    void loadSessions();
  }
}

function isSentinelVisible(): boolean {
  if (!loadMoreSentinel.value) {
    return false;
  }

  const bounds = loadMoreSentinel.value.getBoundingClientRect();

  return bounds.top <= window.innerHeight + 300 && bounds.bottom >= 0;
}

function getSessionRoleLabel(session: UserSessionInterface): string {
  return session.creatorId === userStore.userId
    ? "Booked with me"
    : "My booking";
}

function getCounterpartName(session: UserSessionInterface): string {
  const isCreator = session.creatorId === userStore.userId;
  const counterpart = isCreator ? session.customer : session.creator;
  const counterpartId = isCreator ? session.customerId : session.creatorId;

  return counterpart?.username ?? `User #${counterpartId}`;
}

function formatSessionTime(dateFromValue: string, dateToValue: string): string {
  return `${dateFromValue} – ${dateToValue}`;
}

function getStatusColor(
  status: SessionStatus,
): "success" | "warning" | "error" | "neutral" {
  if (status === "completed") {
    return "success";
  }
  if (status === "cancelled") {
    return "error";
  }
  if (status === "booked") {
    return "warning";
  }

  return "neutral";
}

watch(
  [selectedSessionFilterOption, dateFrom, dateTo],
  () => void loadSessions(true),
);

onMounted(async () => {
  appStore.setIsLoading(true);
  userAuthGuard();

  paginationObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0]?.isIntersecting) {
        void loadSessions();
      }
    },
    { rootMargin: "300px 0px" },
  );

  if (loadMoreSentinel.value) {
    paginationObserver.observe(loadMoreSentinel.value);
  }

  await loadSessions(true);
  appStore.setIsLoading(false);
});

onBeforeUnmount(() => {
  paginationObserver?.disconnect();
});
</script>
