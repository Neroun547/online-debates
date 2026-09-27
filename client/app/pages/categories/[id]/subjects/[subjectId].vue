<template>
  <div class="mt-15">
    <BookSessionModal
      :is-loading="isSlotsLoading"
      :is-booking-button-loading="isBookingButtonLoading"
      v-model:isModalOpen="isBookSessionModalOpen"
      @date-change="(date: string) => loadSlots(date)"
      :available-slots="bookingSlots"
      @book="
        (data: { date: string; slot: GetSlotsForBookingResponseInterface }) =>
          bookSession(data)
      "
    />
    <div v-if="currentSubject">
      <h2 class="text-4xl max-md:text-2xl text-center">
        {{ currentSubject.name }}
      </h2>
      <div class="mt-10">
        <UTable :data="users" :columns="usersTableColumns" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { h } from "vue";
import { useAppStore } from "~/store/app-store";
import { useUserStore } from "~/store/user/user.store";
import { useCategoriesStore } from "~/store/categories/categories.store";
import type { GetSubjectByIdResponseInterface } from "~/store/categories/interfaces/get-subject-by-id-response.interface";
import type { GetUsersBySubjectResponseInterface } from "~/store/user/interfaces/get-users-by-subject-response.interface";
import BookSessionModal from "~/components/subjects/BookSessionModal.vue";
import { useSlotsStore } from "~/store/slots/slots.store";
import type { GetSlotsForBookingResponseInterface } from "~/store/slots/interfaces/get-slots-for-booking-response.interface";
import { DateTime } from "luxon";
import { useSessionsStore } from "~/store/sessions/sessions.store";
import type { TableColumn } from "@nuxt/ui";

const { t } = useI18n();

const sessionStore = useSessionsStore();

const toast = useToast();

const UButton = resolveComponent("UButton");
const UAvatar = resolveComponent("UAvatar");
const UBadge = resolveComponent("UBadge");

const route = useRoute();

const usersStore = useUserStore();
const appStore = useAppStore();
const categoriesStore = useCategoriesStore();
const slotsStore = useSlotsStore();

const currentSubject = ref<GetSubjectByIdResponseInterface>();

const users = ref<GetUsersBySubjectResponseInterface[]>([]);

const page = ref(1);
const limit = ref(20);

const isSlotsLoading = ref<boolean>(false);
const isBookingButtonLoading = ref<boolean>(false);
const isBookSessionModalOpen = ref<boolean>(false);

const activeBookingUser = ref<GetUsersBySubjectResponseInterface>();

const bookingSlots = ref<GetSlotsForBookingResponseInterface[]>([]);

const usersTableColumns = computed<
  TableColumn<GetUsersBySubjectResponseInterface>[]
>(() => [
  {
    accessorKey: "avatarFilename",
    header: "",
    cell: ({ row }) => {
      return h(UAvatar, {
        src: getAvatarFilenamePath(row.original.avatarFilename),
        class: "w-[45px] h-[45px] max-md:w-[30px] max-md:h-[30px]",
      });
    },
  },
  {
    accessorKey: "username",
    header: t("subjects.username"),
    meta: {
      class: {
        th: "max-md:text-xs",
        td: "max-md:text-xs",
      },
    },
  },
  {
    accessorKey: "status",
    header: t("subjects.status"),
    meta: {
      class: {
        th: "max-md:text-xs",
        td: "max-md:text-xs",
      },
    },
    cell: ({ row }) => {
      return h(UBadge, {
        label: row.original.status,
        color: row.original.status === "online" ? "success" : "neutral",
        variant: "soft",
      });
    },
  },
  {
    id: "actions",
    meta: {
      class: {
        td: "text-right max-md:text-xs",
        th: "max-md:text-xs",
      },
    },
    cell: ({ row }) => {
      if (row.original.id === usersStore.userId) {
        return t("subjects.itsYou");
      }
      if (row.original.isAvailableForPermanentSessions) {
        return [
          h(UButton, {
            label: t("subjects.bookSession"),
            class: "cursor-pointer max-md:text-xs",
            onClick: function () {
              activeBookingUser.value = row.original;
              openBookSessionModal();
            },
          }),
          h(UButton, {
            label: t("subjects.startSessionNow"),
            class: "cursor-pointer ml-5 max-md:text-xs",
            onClick: function () {
              startSessionNow(row.original.id);
            },
          }),
        ];
      }
      return h(UButton, {
        label: t("subjects.bookSession"),
        class: "cursor-pointer",
        onClick: function () {
          activeBookingUser.value = row.original;
          openBookSessionModal();
        },
      });
    },
  },
]);

async function bookSession(params: {
  date: string;
  slot: GetSlotsForBookingResponseInterface;
}) {
  isBookingButtonLoading.value = true;

  const currentUserDateTime = DateTime.now().toFormat("yyyy-MM-dd HH:mm");
  await slotsStore.bookSession({
    slot: params.slot,
    currentUserDateTime: currentUserDateTime,
  });

  if (slotsStore.isError) {
    toast.add({
      title: t("subjects.error"),
      description: slotsStore.errorMessage,
      progress: {
        color: "error",
      },
    });
  } else {
    toast.add({
      title: t("subjects.success"),
      description: t("subjects.sessionBookedSuccessfully"),
      progress: {
        color: "success",
      },
    });

    isBookSessionModalOpen.value = false;
  }
  isBookingButtonLoading.value = false;
}

async function startSessionNow(userId: number) {
  const response = await sessionStore.startSessionNow({
    userId: userId,
    subjectId: Number(route.params.subjectId),
    categoryId: Number(route.params.id),
  });

  if (sessionStore.isError) {
    toast.add({
      title: t("subjects.error"),
      description: sessionStore.errorMessage,
      color: "error",
    });
  } else {
    if (response && typeof response.sessionId === "number") {
      toast.add({
        title: t("subjects.success"),
        description: t("subjects.sessionBookedSuccessfully"),
      });

      window.location.href = "/my-sessions/" + response.sessionId;
    }
  }
}

async function loadSlots(date: string) {
  if (activeBookingUser.value) {
    isSlotsLoading.value = true;

    const currentDate = DateTime.fromJSDate(new Date()).toFormat("yyyy-MM-dd");

    const response = await slotsStore.getSlotsForBooking({
      dateFrom:
        date +
        " " +
        (currentDate === date
          ? DateTime.now().toFormat("HH:mm:ss")
          : "00:00:00"),
      dateTo: date + " 23:59:59",
      subjectId: Number(route.params.subjectId),
      userId: activeBookingUser.value.id,
    });

    if (response) {
      bookingSlots.value = response;
    }
    isSlotsLoading.value = false;
  }
}

async function getCurrentSubject() {
  const response = await categoriesStore.getSubjectById(
    Number(route.params.subjectId),
  );
  if (response) {
    currentSubject.value = response;
  }
}

async function getUsers() {
  const response = await usersStore.getUsersSubjectId({
    subjectId: Number(route.params.subjectId),
    page: page.value,
    limit: limit.value,
  });

  if (response) {
    users.value.push(...response);
  }
}

function openBookSessionModal() {
  isBookSessionModalOpen.value = true;
}

onMounted(() => {
  getCurrentSubject().then(() => {
    appStore.setIsLoading(false);
  });

  getUsers();
});
</script>
