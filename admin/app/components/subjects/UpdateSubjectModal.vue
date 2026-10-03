<template>
  <UModal>
    <template #title>
      <h2>Update Subject</h2>
    </template>
    <template #body>
      <UForm :state="formState" :schema="formSchema" @submit="updateSubject">
        <UFormField label="Name" class="w-full" name="name">
          <UInput
            placeholder="Name:"
            class="w-full"
            v-model="formState.name"
            name="name"
          />
        </UFormField>
        <UFormField label="Category" class="w-1/2 mt-5" name="category">
          <USelectMenu
            :items="categories"
            ref="categoriesSelect"
            value-key="id"
            label-key="name"
            class="w-full"
            @update:search-term="onCategoriesSelectSearch"
            v-model="formState.category"
            name="category"
          />
        </UFormField>
        <UFormField label="User" class="w-1/2 mt-5" name="user">
          <div class="flex">
            <USelectMenu
              :items="users"
              placeholder="User"
              ref="usersSelect"
              value-key="id"
              label-key="username"
              class="w-full"
              @update:search-term="onUsersSelectSearch"
              v-model="formState.user"
              name="user"
            >
              <template #item="{ item }">
                <div>
                  <h2>{{ item.username }}</h2>
                  <p class="text-xs mt-2">{{ item.email }}</p>
                </div>
              </template>
            </USelectMenu>
            <UButton
              label="Clear"
              class="ml-2 cursor-pointer"
              @click="clearUser"
            />
          </div>
        </UFormField>
        <USeparator class="mt-5 mb-5" />
        <div class="flex justify-end">
          <div class="flex">
            <UButton
              label="Cancel"
              color="error"
              class="mr-3 cursor-pointer"
              @click="emit('close', false)"
            />
            <UButton label="Update" type="submit" class="cursor-pointer" />
          </div>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
<script setup lang="ts">
import { useInfiniteScroll } from "@vueuse/core";
import { useCategoriesStore } from "~/store/categories/categories.store";
import type { CategoryItem } from "~/store/categories/interfaces/get-categories-response.interface";
import * as zod from "zod";
import type { UserItemInterface } from "~/store/users/interfaces/get-users-response.interface";
import { useUsersStore } from "~/store/users/users.store";
import type { UserStatus } from "~/store/auth/interfaces/auth-store.interface";

interface Props {
  name: string;
  category: {
    id: number;
    name: string;
    priority: number;
  };
  user?: {
    id: number;
    username: string;
    email: string;
    status: UserStatus;
    timezone: string;
  };
}

interface FormState {
  name: string;
  category: number | undefined;
  user: number | undefined;
}

type UserSelectItem = Pick<UserItemInterface, "id" | "username" | "email">;

const props = defineProps<Props>();

const formSchema = zod.object({
  name: zod.string().trim().min(1).max(500),
  category: zod.number(),
  user: zod.number().optional(),
});

const formState = reactive<FormState>({
  name: "",
  category: undefined,
  user: undefined,
});

const usersStore = useUsersStore();
const usersSelect = useTemplateRef("usersSelect");

const categoriesStore = useCategoriesStore();
const categoriesSelect = useTemplateRef("categoriesSelect");

const categoriesPaginationPage = ref(1);
const categoriesPaginationLimit = 20;

const usersPaginationPage = ref(1);
const usersPaginationLimit = 20;

const categories = ref<CategoryItem[]>([]);
const users = ref<UserSelectItem[]>([]);

const isUsersLoading = ref(false);
const isCategoriesLoading = ref(false);
const isLoadMoreCategoriesPossible = ref(true);

const isLoadMoreUsersPossible = ref(false);

const currentSearchName = ref<string>("");
const isSearchByNameProgress = ref<boolean>(false);
const isSearchByUsernameProgress = ref<boolean>(false);

const currentSearchUsername = ref<string>("");

const emit = defineEmits(["close"]);

function clearUser() {
  formState.user = undefined;
}

function updateSubject(e: Event) {
  e.preventDefault();

  emit("close", {
    name: formState.name,
    category: formState.category,
    user: formState.user,
  });
}

async function getUsers(isSearch?: boolean) {
  isUsersLoading.value = true;

  const response = await usersStore.getUsers({
    page: usersPaginationPage.value,
    limit: usersPaginationLimit,
    searchUsername: currentSearchUsername.value,
  });

  if (response && response.data) {
    if (isSearch) {
      const currentSelectedUser = users.value.find(
        (user) => user.id === formState.user,
      );
      const parsedResponse = response.data.filter(
        (responseUser) =>
          users.value.findIndex(
            (userItem) => userItem.id === responseUser.id,
          ) === -1,
      );
      users.value = currentSelectedUser
        ? [currentSelectedUser, ...parsedResponse]
        : parsedResponse;
    } else {
      const parsedResponse = response.data.filter(
        (responseUser) =>
          users.value.findIndex(
            (userItem) => userItem.id === responseUser.id,
          ) === -1,
      );
      users.value.push(...parsedResponse);
    }
    isLoadMoreUsersPossible.value =
      response.isLoadMorePossible &&
      response.data.length >= usersPaginationLimit;
  } else {
    isLoadMoreUsersPossible.value = false;
  }
  isUsersLoading.value = false;
}

function onCategoriesSelectSearch(value: string) {
  currentSearchName.value = value;
  categoriesPaginationPage.value = 1;
}

function onUsersSelectSearch(value: string) {
  currentSearchUsername.value = value;
  usersPaginationPage.value = 1;
}

async function getCategories(isSearch?: boolean) {
  isCategoriesLoading.value = true;

  const response = await categoriesStore.getCategories(
    categoriesPaginationPage.value,
    categoriesPaginationLimit,
    currentSearchName.value.trim() ? currentSearchName.value.trim() : undefined,
  );

  if (response && response.data) {
    if (isSearch) {
      const currentSelectedCategory = categories.value.find(
        (category) => formState.category === category.id,
      );
      const parsedResponse = response.data.filter(
        (responseItem) =>
          categories.value.findIndex(
            (categoryItem) => categoryItem.id === responseItem.id,
          ) === -1,
      );
      categories.value = currentSelectedCategory
        ? [currentSelectedCategory, ...parsedResponse]
        : parsedResponse;
    } else {
      const parsedResponse = response.data.filter(
        (responseItem) =>
          categories.value.findIndex(
            (categoryItem) => categoryItem.id === responseItem.id,
          ) === -1,
      );
      categories.value.push(...parsedResponse);
    }
    isLoadMoreCategoriesPossible.value =
      response.count > categories.value.length &&
      response.data.length >= categoriesPaginationLimit;
  } else {
    isLoadMoreCategoriesPossible.value = false;
  }
  isCategoriesLoading.value = false;
}

watch(usersPaginationPage, () => {
  if (!isSearchByUsernameProgress.value) {
    getUsers(false);
  }
});

watch(currentSearchUsername, () => {
  isSearchByUsernameProgress.value = true;
  getUsers(true).then(() => {
    isSearchByUsernameProgress.value = false;
  });
});

watch(categoriesPaginationPage, () => {
  if (!isSearchByNameProgress.value) {
    getCategories(false);
  }
});

watch(currentSearchName, () => {
  isSearchByNameProgress.value = true;
  getCategories(true).then(() => {
    isSearchByNameProgress.value = false;
  });
});

watch(
  props,
  () => {
    formState.name = props.name;
    formState.user = props.user ? props.user.id : undefined;
    formState.category = props.category.id;

    categories.value.push(props.category);

    if (props.user) {
      users.value.push(props.user);
    }
  },
  { immediate: true },
);

onMounted(() => {
  useInfiniteScroll(
    () => categoriesSelect.value?.viewportRef,
    () => {
      categoriesPaginationPage.value += 1;
    },
    {
      canLoadMore: () => {
        return !isCategoriesLoading.value && isLoadMoreCategoriesPossible.value;
      },
    },
  );

  useInfiniteScroll(
    () => usersSelect.value?.viewportRef,
    () => {
      usersPaginationPage.value += 1;
    },
    {
      canLoadMore: () => {
        return !isUsersLoading.value && isLoadMoreUsersPossible.value;
      },
    },
  );

  getCategories(false);
  getUsers(false);
});
</script>
