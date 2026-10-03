<template>
  <div class="mt-15">
    <BookSessionModal
      v-model:is-modal-open="isBookSessionModalOpen"
      :is-loading="isSlotsLoading"
      :is-booking-button-loading="isBookingButtonLoading"
      :available-slots="bookingSlots"
      @date-change="(date: string) => loadSlots(date, activeSubjectId)"
      @book="bookSession"
    />
    <div class="flex items-center">
      <div>
        <UAvatar
          icon="i-lucide-user-round"
          size="3xl"
          color="primary"
          class="size-34 shadow ring-4 ring-primary/10"
          :ui="{ icon: 'w-[50px] h-[50px]' }"
          :src="
            profile.avatarFilename
              ? getAvatarFilenamePath(profile.avatarFilename)
              : undefined
          "
        />
      </div>
      <div class="ml-5">
        <p class="font-bold text-xl">{{ profile.username }}</p>
        <p class="text-sm">{{ profile.email }}</p>
        <p class="text-sm">{{ $t("userProfile.age") }}: {{ profile.age }}</p>
        <p class="text-sm">
          {{ $t("userProfile.sex") }}: {{ getUserSexLabel(profile.sex) }}
        </p>
        <p class="text-sm">
          {{ $t("userProfile.timezone") }}: {{ profile.timezone }}
        </p>
        <UBadge
          v-if="profile.status === UserStatus.ONLINE"
          :label="profile.status"
          color="success"
          variant="soft"
        />
        <UBadge
          v-if="profile.status === UserStatus.OFFLINE"
          :label="profile.status"
          color="neutral"
          variant="soft"
        />
      </div>
    </div>
    <div v-if="profile.description" class="mt-5">
      <h2 class="font-bold text-xl">{{ $t("userProfile.aboutUser") }}</h2>
      <p class="mt-5 text-sm max-w-[800px] text-justify">
        {{ profile.description }}
      </p>
    </div>
    <h2 class="mt-15 font-bold text-2xl text-center">
      {{ $t("userProfile.subjectsTitle") }}
    </h2>
    <div class="mt-5 mx-auto max-w-5xl">
      <div v-for="subject in userSubjects" class="shadow-sm p-5 mt-5">
        <h2 class="font-bold text-xl">{{ subject.name }}</h2>
        <p v-if="subject.category" class="text-sm">
          {{ getCategoryNameTranslate(subject.category) }}
        </p>
        <div class="flex justify-end">
          <UButton
            variant="soft"
            icon="lucide:calendar-plus"
            class="cursor-pointer justify-center mr-3"
            @click="localOpenBookingModal(subject.id)"
          >
            {{ t("subjects.bookSession") }}
          </UButton>
          <UButton
            v-if="profile.isAvailableForPermanentSessions"
            icon="lucide:video"
            class="cursor-pointer justify-center"
            @click="
              () =>
                subject.category
                  ? startSessionNow(userId, subject.id, subject.category.id)
                  : undefined
            "
          >
            {{ t("subjects.startSessionNow") }}
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BookSessionModal from "~/components/subjects/BookSessionModal.vue";
import { useAppStore } from "~/store/app-store";
import type { CategoryItem } from "~/store/categories/interfaces/get-categories-response.interface";
import type { SubjectItem } from "~/store/categories/interfaces/get-subjects-response.interface";
import { UserStatus, useUserStore } from "~/store/user/user.store";

interface UserProfile {
  username: string;
  age: number;
  avatarFilename: string | null;
  description: string;
  email: string;
  isAvailableForPermanentSessions: boolean;
  timezone: string;
  status: string;
  sex: "male" | "female";
}

const route = useRoute();
const { t, locale } = useI18n();

const userId = computed(() => Number(route.params.id));
const activeSubjectId = ref();

const {
  bookingSlots,
  isBookingButtonLoading,
  isBookSessionModalOpen,
  isSlotsLoading,
  bookSession,
  loadSlots,
  openBookSessionModal,
  startSessionNow,
} = useBookSession({});

const profile = reactive<UserProfile>({
  username: "",
  age: 14,
  avatarFilename: null as string | null,
  description: "",
  email: "",
  isAvailableForPermanentSessions: false,
  timezone: "",
  status: "",
  sex: "male",
});

const userSubjects = ref<SubjectItem[]>([]);

const appStore = useAppStore();
const userStore = useUserStore();

function getUserSexLabel(sex: "male" | "female") {
  if (sex === "male") {
    return t("userProfile.male");
  } else {
    return t("userProfile.female");
  }
}

async function loadUserData() {
  const response = await userStore.getUserWithSubjectsById(
    Number(route.params.id),
  );

  if (response) {
    profile.username = response.username;
    profile.age = response.age;
    profile.avatarFilename = response.avatarFilename;
    profile.email = response.email;
    profile.isAvailableForPermanentSessions =
      response.isAvailableForPermanentSessions;
    profile.timezone = response.timezone;
    profile.description = response.description ?? "";
    profile.status = response.status;
    profile.sex = response.sex;

    if (response.subjects) {
      userSubjects.value = response.subjects;
    }
  }
}

function getCategoryNameTranslate(category: CategoryItem): string {
  if (locale.value === "uk") {
    return category.translateNameUk ?? category.name;
  } else if (locale.value === "ru") {
    return category.translateNameRu ?? category.name;
  } else {
    return category.translateNameEn ?? category.name;
  }
}

function localOpenBookingModal(subjectId: number) {
  activeSubjectId.value = subjectId;

  openBookSessionModal({
    id: userId.value,
    email: profile.email,
    username: profile.username,
    status: profile.status,
    timezone: profile.timezone,
    isAvailableForPermanentSessions: profile.isAvailableForPermanentSessions,
    avatarFilename: profile.avatarFilename,
    sex: profile.sex
  });
}

onMounted(() => {
  loadUserData().finally(() => {
    appStore.setIsLoading(false);
  });
});
</script>
