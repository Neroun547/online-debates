<template>
  <div class="mt-15">
    <h2 class="text-4xl max-md:text-2xl">{{ $t("mySessions.title") }}</h2>

    <div class="mt-10 flex flex-wrap items-end gap-4">
      <UFormField :label="$t('mySessions.sessions')">
        <USelect
          v-model="selectedSessionFilterOption"
          :items="filtersSessionsSelectOptions"
          class="min-w-48 max-sm:text-xs"
          :ui="{ content: 'min-w-fit' }"
        />
      </UFormField>

      <UFormField :label="$t('mySessions.dateFrom')">
        <input
          id="sessions-date-from"
          v-model="dateFrom"
          type="date"
          :max="dateTo || undefined"
          class="max-sm:text-xs h-8 rounded-md border border-default bg-default px-2.5 text-sm text-highlighted outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
      </UFormField>

      <UFormField :label="$t('mySessions.dateTo')">
        <input
          id="sessions-date-to"
          v-model="dateTo"
          type="date"
          :min="dateFrom || undefined"
          class="max-sm:text-xs h-8 rounded-md border border-default bg-default px-2.5 text-sm text-highlighted outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
      </UFormField>
    </div>

    <UAlert
      v-if="!isDateRangeValid"
      class="mt-6"
      color="error"
      variant="soft"
      :title="$t('mySessions.invalidDateRange')"
      :description="$t('mySessions.dateRangeDescription')"
      icon="i-lucide-calendar-x"
    />

    <UAlert
      v-else-if="isError"
      class="mt-6"
      color="error"
      variant="soft"
      :title="$t('mySessions.couldNotLoadSessions')"
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
          {{ $t("mySessions.tryAgain") }}
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
              <UAvatar
                icon="i-lucide-user-round"
                class="w-[45px] h-[45px] max-md:w-[35px] max-md:h-[35px]"
                :src="
                  session.creatorId !== userStore.userId && session.creator
                    ? getAvatarFilenamePath(session.creator.avatarFilename)
                    : session.customer
                      ? getAvatarFilenamePath(session.customer.avatarFilename)
                      : ''
                "
              />
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
                  {{ getSessionStatusLabel(session.status) }}
                </UBadge>
              </div>

              <p class="mt-1 text-sm text-muted">
                {{ $t("mySessions.withUser") }}
                <ULink
                  :to="'/users/' + getCounterpartUser(session).id"
                  class="truncate font-semibold text-blue-800 underline"
                >
                  {{ getCounterpartName(session) }}
                </ULink>

                <UBadge
                  v-if="
                    userStore.userId !== session.creatorId && session.creator
                  "
                  variant="soft"
                  :color="
                    session.creator.status === 'offline' ? 'neutral' : 'success'
                  "
                  class="ml-2"
                  >{{ getUserStatusLabel(session.creator.status) }}</UBadge
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
                  >{{ getUserStatusLabel(session.customer.status) }}</UBadge
                >
              </p>
              <div class="mt-2">
                <UBadge
                  :color="
                    session.isAnotherUserInSession ? 'success' : 'neutral'
                  "
                  variant="soft"
                >
                  <span
                    v-if="session.isAnotherUserInSession"
                    class="relative mr-1 flex size-2"
                  >
                    <span
                      class="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75"
                    />
                    <span
                      class="relative inline-flex size-2 rounded-full bg-success"
                    />
                  </span>
                  <span
                    v-else
                    class="mr-1 inline-flex size-2 rounded-full bg-neutral-400 max-sm:text-xs"
                  />
                  {{
                    $t(
                      session.isAnotherUserInSession
                        ? "mySessions.anotherUserInSession"
                        : "mySessions.anotherUserNotInSession",
                    )
                  }}
                </UBadge>
              </div>
            </div>
          </div>

          <div v-if="session.slot" class="text-left sm:text-right">
            <p class="font-medium text-highlighted max-sm:text-sm">
              {{ session.slot.startTime }}
            </p>
            <p class="mt-1 text-sm text-muted max-sm:text-xs">
              {{
                formatSessionTime(session.slot.startTime, session.slot.endTime)
              }}
            </p>
          </div>
          <div
            v-if="
              !session.slot &&
              session.createdAt &&
              session.creatorId === userStore.userId
            "
          >
            <p class="font-medium text-highlighted max-sm:text-xs">
              {{
                $t("mySessions.permanentBookedWithYou", {
                  date: session.createdAt,
                })
              }}
            </p>
          </div>
          <div
            v-if="
              !session.slot &&
              session.createdAt &&
              session.creatorId !== userStore.userId
            "
          >
            <p class="font-medium text-highlighted max-sm:text-xs">
              {{
                $t("mySessions.permanentCreatedByYou", {
                  date: session.createdAt,
                })
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
              :text="
                $t('mySessions.startAt', {
                  date: session.slot?.startTime,
                })
              "
              v-if="
                !isSessionStarted(session.slot?.startTime ?? '') &&
                session.status === 'booked' &&
                session.slot
              "
            >
              <UButton
                :label="$t('mySessions.start')"
                class="cursor-pointer max-sm:text-xs"
                :disabled="true"
              />
            </UTooltip>
            <UTooltip
              v-if="
                isSessionStarted(session.slot?.startTime ?? '') &&
                session.status === 'booked' &&
                session.slot
              "
              :text="$t('mySessions.startNow')"
            >
              <UButton
                :label="$t('mySessions.start')"
                class="cursor-pointer max-sm:text-xs"
                @click="startSession(session.id)"
              />
            </UTooltip>
            <UTooltip
              v-if="session.status === 'booked' && !session.slot"
              :text="$t('mySessions.startNow')"
            >
              <UButton
                :label="$t('mySessions.start')"
                class="cursor-pointer max-sm:text-xs"
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
        {{ $t("mySessions.noSessions") }}
      </h2>
      <p class="mt-1 text-sm text-muted">
        {{ $t("mySessions.changeFilters") }}
      </p>
    </div>

    <div ref="loadMoreSentinel" class="h-px" aria-hidden="true" />

    <div
      v-if="isLoadingMore"
      class="flex items-center justify-center gap-2 py-8 text-sm text-muted"
    >
      <UIcon name="i-lucide-loader-circle" class="size-5 animate-spin" />
      {{ $t("mySessions.loadingMore") }}
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
  SessionUserInterface,
  UserSessionInterface,
  UserSessionsFilter,
} from "~/store/sessions/interfaces/get-user-sessions.interface";
import { useSessionsStore } from "~/store/sessions/sessions.store";
import { useUserStore } from "~/store/user/user.store";

const { t } = useI18n();

const router = useRouter();

const appStore = useAppStore();
const sessionsStore = useSessionsStore();
const userStore = useUserStore();
const { errorMessage, isError } = storeToRefs(sessionsStore);

const filtersSessionsSelectOptions = computed<
  Array<{
    label: string;
    value: UserSessionsFilter;
  }>
>(() => [
  {
    label: t("mySessions.bookedWithMe"),
    value: "booked_with_me",
  },
  {
    label: t("mySessions.myBookings"),
    value: "my_booking",
  },
  {
    label: t("mySessions.all"),
    value: "all",
  },
]);

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
      dateFrom: dateFrom.value,
      dateTo: dateTo.value,
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

    allSessions.value = [...allSessions.value, ...newSessions];
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
  if (!session.slot) {
    return t("mySessions.permanentSession");
  }
  return session.creatorId === userStore.userId
    ? t("mySessions.bookedWithMe")
    : t("mySessions.myBooking");
}

function getCounterpartName(session: UserSessionInterface): string {
  const isCreator = session.creatorId === userStore.userId;
  const counterpart = isCreator ? session.customer : session.creator;
  const counterpartId = isCreator ? session.customerId : session.creatorId;

  return (
    counterpart?.username ??
    t("mySessions.userNumber", {
      id: counterpartId,
    })
  );
}

function getCounterpartUser(
  session: UserSessionInterface,
): SessionUserInterface {
  const isCreator = session.creatorId === userStore.userId;
  const counterpart = isCreator ? session.customer : session.creator;

  return counterpart as SessionUserInterface;
}

function getSessionStatusLabel(status: SessionStatus): string {
  if (status === "booked") {
    return t("mySessions.statusBooked");
  }
  if (status === "completed") {
    return t("mySessions.statusCompleted");
  }

  return t("mySessions.statusCancelled");
}

function getUserStatusLabel(status: SessionUserInterface["status"]): string {
  if (status === "online") {
    return t("mySessions.statusOnline");
  }
  if (status === "busy") {
    return t("mySessions.statusBusy");
  }

  return t("mySessions.statusOffline");
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
