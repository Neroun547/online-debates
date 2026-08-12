<template>
  <div class="mt-15">
    <BookSessionModal
      v-model:isModalOpen="isBookSessionModalOpen"
      @date-change="(date: string) => loadSlots(date)"
      :available-slots="bookingSlots"
    />
    <div v-if="currentSubject">
      <h2 class="text-4xl text-center">{{ currentSubject.name }}</h2>
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
import type { UserInterface } from "~/store/user/interfaces/user-response.interface";
import type { GetSlotsForBookingResponseInterface } from "~/store/slots/interfaces/get-slots-for-booking-response.interface";

const UButton = resolveComponent("UButton");

const route = useRoute();

const usersStore = useUserStore();
const appStore = useAppStore();
const categoriesStore = useCategoriesStore();
const slotsStore = useSlotsStore();

const currentSubject = ref<GetSubjectByIdResponseInterface>();

const users = ref<GetUsersBySubjectResponseInterface[]>([]);

const page = ref(1);
const limit = ref(20);

const isBookSessionModalOpen = ref<boolean>(false);

const activeBookingUser = ref<UserInterface>();

const bookingSlots = ref<GetSlotsForBookingResponseInterface[]>([]);

const usersTableColumns = [
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    id: "actions",
    meta: {
      class: {
        td: "text-right",
      },
    },
    cell: ({ row }) => {
      if (row.original.id === usersStore.userId) {
        return "It's you";
      }
      return h(UButton, {
        label: "Book session",
        class: "cursor-pointer",
        onClick: function () {
          activeBookingUser.value = row.original;
          openBookSessionModal();
        },
      });
    },
  },
];

async function loadSlots(date: string) {
  if (activeBookingUser.value) {
    const response = await slotsStore.getSlotsForBooking({
      dateFrom: date + " 00:00:00",
      dateTo: date + " 23:59:59",
      subjectId: Number(route.params.subjectId),
      userId: activeBookingUser.value.id,
    });

    if(response) {
      bookingSlots.value = response;
    }
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
