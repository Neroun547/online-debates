<template>
  <div>
    <div class="flex justify-between">
      <div class="text-2xl">Users</div>
      <div>
        <UButton
          label="Create user"
          icon="lucide:plus"
          @click="openCreateUserModal"
        />
      </div>
    </div>
    <UTable :data="users" :columns="tableColumns">
      <template #actions-cell="{ row }">
        <div class="flex justify-end gap-5">
          <UTooltip text="Edit user">
            <UButton
              icon="lucide:pencil"
              size="xs"
              class="cursor-pointer"
              @click="openUpdateUserModal(row.original)"
            />
          </UTooltip>
          <UTooltip text="Delete user">
            <UButton
              icon="lucide:trash-2"
              size="xs"
              color="error"
              class="cursor-pointer"
              @click="openDeleteUserModal(row.original)"
            />
          </UTooltip>
        </div>
      </template>
    </UTable>
    <div class="flex justify-end border-t border-default pt-4 px-4">
      <UPagination
        :page="page"
        :items-per-page="limit"
        :total="totalUsersCount"
        @update:page="(p) => updatePage(p)"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import BaseDeleteModal from "~/components/BaseDeleteModal.vue";
import CreateUserModal from "~/components/users/CreateUserModal.vue";
import UpdateUserModal from "~/components/users/UpdateUserModal.vue";
import type { UserItemInterface } from "~/store/users/interfaces/get-users-response.interface";
import { useUsersStore } from "~/store/users/users.store";

const toast = useToast();

const overlay = useOverlay();

const deleteUserModal = overlay.create(BaseDeleteModal);
const createUserModal = overlay.create(CreateUserModal);
const updateUserModal = overlay.create(UpdateUserModal);

const isUsersLoading = ref<boolean>(false);

const page = ref<number>(1);
const limit = 20;

const totalUsersCount = ref(0);

const tableColumns: TableColumn<UserItemInterface>[] = [
  {
    accessorKey: "id",
  },
  {
    accessorKey: "email",
  },
  {
    accessorKey: "username",
  },
  {
    accessorKey: "status",
  },
  {
    accessorKey: "timezone",
  },
  {
    id: "actions",
  },
];

const users = ref<UserItemInterface[]>([]);

const usersStore = useUsersStore();

function updatePage(p: number) {
  page.value = p;
}

async function openUpdateUserModal(user: UserItemInterface) {
  const result = await updateUserModal.open({
    username: user.username,
    email: user.email,
    timezone: user.timezone,
  });

  if (result && typeof result === "object") {
    await usersStore.updateUser({
      id: user.id,
      username: result.username,
      email: result.email,
      password:
        typeof result.password === "string" && result.password.length >= 8
          ? result.password
          : undefined,
      timezone: result.timezone,
    });

    if (usersStore.isError) {
      toast.add({
        title: "Error",
        description: usersStore.errorMessage,
        color: "error",
      });
    } else {
      toast.add({
        title: "Success",
        description: "User updated successfully",
        color: "success",
      });

      isUsersLoading.value = true;
      page.value = 1;

      await getUsers();

      isUsersLoading.value = false;
    }
  }
}

async function openCreateUserModal() {
  const result = await createUserModal.open();

  if (result && typeof result === "object") {
    await usersStore.createUser({
      username: result.username,
      email: result.email,
      timezone: result.timezone,
      password: result.password,
    });

    if (usersStore.isError) {
      toast.add({
        title: "Error",
        description: usersStore.errorMessage,
        color: "error",
      });
    } else {
      toast.add({
        title: "Success",
        description: "User saved successfully",
        color: "success",
      });

      isUsersLoading.value = true;
      page.value = 1;

      await getUsers();

      isUsersLoading.value = false;
    }
  }
}

async function openDeleteUserModal(user: UserItemInterface) {
  const result = await deleteUserModal.open({
    title: "Delete " + user.username,
    description:
      "Do you really want delete " + user.username + " (" + user.email + ") ?",
  });

  if (result) {
    await usersStore.deleteUserById(user.id);

    isUsersLoading.value = true;
    page.value = 1;
    await getUsers();

    isUsersLoading.value = false;
  }
}

async function getUsers() {
  const response = await usersStore.getUsers({
    page: page.value,
    limit: limit,
  });

  if (response && response.data) {
    users.value = response.data;
    totalUsersCount.value = response.count;
  }
}

watch(page, () => {
  if (!isUsersLoading.value) {
    getUsers();
  }
});

onMounted(() => {
  getUsers();
});
</script>
