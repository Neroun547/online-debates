<template>
  <div class="mt-15 pb-10">
    <BookSessionModal
      v-model:is-modal-open="isBookSessionModalOpen"
      :is-loading="isSlotsLoading"
      :is-booking-button-loading="isBookingButtonLoading"
      :available-slots="bookingSlots"
      :available-dates="availableDatesForBookingCalendar"
      :default-selected-date="defaultSelectedDate"
      v-model:calendar-state="calendarState"
      @date-change="loadSlots"
      @book="bookSession"
    />
    <section v-if="currentSubject" class="mx-auto max-w-5xl">
      <div class="mb-10 text-center">
        <div
          class="mb-4 inline-flex size-12 items-center justify-center bg-primary/10 text-primary"
        >
          <UIcon name="lucide:messages-square" class="size-6" />
        </div>
        <h1 class="text-4xl font-semibold tracking-tight max-md:text-2xl">
          {{ currentSubject.name }}
        </h1>
        <p class="mx-auto mt-3 max-w-2xl text-sm text-gray-500 sm:text-base">
          {{ t("subjects.chooseParticipant") }}
        </p>
      </div>

      <div class="mb-4 flex items-center justify-between gap-4">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
          {{ t("subjects.participants") }}
        </h2>
      </div>

      <div v-if="users.length" class="space-y-3">
        <article
          v-for="user in users"
          :key="user.id"
          class="group relative overflow-hidden border border-gray-200 bg-white p-4 shadow-sm transition duration-200 dark:border-gray-800 dark:bg-gray-900 sm:p-5"
        >
          <div
            class="absolute inset-y-0 left-0 w-1 bg-primary opacity-0 transition-opacity"
          />

          <div
            class="flex items-center gap-4 max-md:items-start max-sm:flex-col"
          >
            <div class="relative shrink-0">
              <UAvatar
                icon="i-lucide-user-round"
                size="3xl"
                color="primary"
                class="size-16 ring-4 ring-gray-50 dark:ring-gray-800 sm:size-18"
                :src="
                  user.avatarFilename
                    ? getAvatarFilenamePath(user.avatarFilename)
                    : undefined
                "
              />
              <span
                :class="[
                  'absolute bottom-0.5 right-0.5 size-4 border-[3px] border-white dark:border-gray-900 rounded-full',
                  user.status === 'online' ? 'bg-emerald-500' : 'bg-gray-300',
                ]"
              />
            </div>

            <div class="min-w-0 flex-1 max-sm:w-full">
              <div class="flex flex-wrap items-center gap-2">
                <ULink
                  :to="'/users/' + user.id"
                  v-if="usersStore.userId !== user.id"
                >
                  <h3
                    class="truncate text-lg font-semibold text-blue-800 underline"
                  >
                    {{ user.username }}
                  </h3>
                </ULink>
                <h3
                  class="truncate text-lg font-semibold"
                  v-if="usersStore.userId === user.id"
                >
                  {{ user.username }}
                </h3>
                <UBadge
                  :color="user.status === 'online' ? 'success' : 'neutral'"
                  variant="soft"
                  size="sm"
                  class="capitalize"
                >
                  {{ user.status }}
                </UBadge>
                <UBadge
                  v-if="user.id === usersStore.userId"
                  color="primary"
                  variant="subtle"
                  size="sm"
                >
                  {{ t("subjects.itsYou") }}
                </UBadge>
              </div>

              <div
                class="mt-2 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-gray-500 dark:text-gray-400"
              >
                <span class="flex min-w-0 items-center gap-1.5">
                  <UIcon name="lucide:mail" class="size-4 shrink-0" />
                  <span class="truncate">{{ user.email }}</span>
                </span>
                <span v-if="user.timezone" class="flex items-center gap-1.5">
                  <UIcon name="lucide:clock-3" class="size-4 shrink-0" />
                  {{ user.timezone }}
                </span>
              </div>
              <div class="mt-1">
                <p class="text-xs">
                  <span>{{ $t("subjects.sex") }}:</span>
                  {{ getUserSexLabel(user.sex) }}
                </p>
              </div>
              <div
                v-if="user.isAvailableForPermanentSessions"
                class="mt-3 flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400"
              >
                <UIcon name="lucide:circle-check" class="size-4" />
                {{ t("settings.availableForPermanentSessions") }}
              </div>
            </div>

            <div
              v-if="user.id !== usersStore.userId"
              class="flex shrink-0 items-center gap-2 max-md:flex-col max-md:items-stretch max-sm:w-full max-sm:flex-row max-[460px]:flex-col"
            >
              <UButton
                variant="soft"
                icon="lucide:calendar-plus"
                class="cursor-pointer justify-center"
                @click="openBookSessionModal(user)"
              >
                {{ t("subjects.bookSession") }}
              </UButton>
              <UButton
                v-if="user.isAvailableForPermanentSessions"
                icon="lucide:video"
                class="cursor-pointer justify-center"
                @click="startSessionNow(user.id)"
              >
                {{ t("subjects.startSessionNow") }}
              </UButton>
            </div>
          </div>
        </article>
      </div>

      <div
        v-else
        class="border border-dashed border-gray-300 bg-gray-50 px-6 py-14 text-center dark:border-gray-700 dark:bg-gray-900/50"
      >
        <div
          class="mx-auto flex size-12 items-center justify-center bg-white text-gray-400 shadow-sm dark:bg-gray-800"
        >
          <UIcon name="lucide:user-round-search" class="size-6" />
        </div>
        <h3 class="mt-4 font-semibold text-gray-900 dark:text-white">
          {{ t("subjects.noParticipants") }}
        </h3>
        <p class="mt-1 text-sm text-gray-500">
          {{ t("subjects.noParticipantsDescription") }}
        </p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from "~/store/app-store";
import { useUserStore } from "~/store/user/user.store";
import { useCategoriesStore } from "~/store/categories/categories.store";
import type { GetSubjectByIdResponseInterface } from "~/store/categories/interfaces/get-subject-by-id-response.interface";
import type { GetUsersBySubjectResponseInterface } from "~/store/user/interfaces/get-users-by-subject-response.interface";
import BookSessionModal from "~/components/subjects/BookSessionModal.vue";
import { useBookSession } from "~/composables/book-session.composable";

const { t } = useI18n();

const route = useRoute();

const usersStore = useUserStore();
const appStore = useAppStore();
const categoriesStore = useCategoriesStore();

const categoryId = computed(() => Number(route.params.id));
const subjectId = computed(() => Number(route.params.subjectId));

const calendarState = ref({
  year: new Date().getFullYear(),
  month: new Date().getMonth() + 1
});

const {
  bookingSlots,
  isBookingButtonLoading,
  isBookSessionModalOpen,
  isSlotsLoading,
  bookSession,
  loadSlots,
  openBookSessionModal,
  startSessionNow,
  availableDatesForBookingCalendar,
  defaultSelectedDate
} = useBookSession({
  categoryId: categoryId.value,
  subjectId: subjectId.value,
  currentCalendarState: calendarState
});

const currentSubject = ref<GetSubjectByIdResponseInterface>();

const users = ref<GetUsersBySubjectResponseInterface[]>([]);

const page = ref(1);
const limit = ref(20);

function getUserSexLabel(sex: "male" | "female") {
  if (sex === "male") {
    return t("userProfile.male");
  } else {
    return t("userProfile.female");
  }
}

async function getCurrentSubject() {
  const response = await categoriesStore.getSubjectById(subjectId.value);
  if (response) {
    currentSubject.value = response;
  }
}

async function getUsers() {
  const response = await usersStore.getUsersSubjectId({
    subjectId: subjectId.value,
    page: page.value,
    limit: limit.value,
  });

  if (response) {
    users.value.push(...response);
  }
}

onMounted(() => {
  getCurrentSubject().then(() => {
    appStore.setIsLoading(false);
  });

  getUsers();
});
</script>
