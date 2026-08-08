<template>
  <div class="mt-15">
    <DeleteAccountModal
      :loading="isDeleteAccountModalLoading"
      v-model:is-open="isDeleteAccountModalShow"
      @close="() => (isDeleteAccountModalShow = false)"
      @confirm="deleteAccount"
    />

    <ConfirmYourNewEmailModal
      v-model:is-open="isConfirmNewEmailModalShow"
      @close="() => (isConfirmNewEmailModalShow = false)"
    />

    <h2 class="text-4xl">Settings</h2>
    <div class="flex flex-col">
      <div class="flex flex-col mt-10 w-full max-w-[800px]">
        <div class="w-full">
          <UForm
            @submit.prevent="updateEmail"
            :state="user"
            :schema="updateEmailUserSchema"
          >
            <UFormField name="email" label="Email">
              <UInput
                placeholder="Email"
                class="w-full"
                v-model="user.email"
                name="email"
              />
            </UFormField>

            <UButton
              class="w-min mt-5 block cursor-pointer"
              label="Save New Email"
              type="submit"
              :disabled="isUpdateEmailButtonDisabled"
            />
          </UForm>
        </div>
        <div class="w-full mt-3">
          <UForm
            @submit.prevent="updateUsername"
            :schema="updateUsernameFormSchema"
            :state="user"
          >
            <UFormField label="Username" name="username">
              <UInput
                placeholder="Username"
                class="w-full"
                v-model="user.username"
                name="username"
              />
            </UFormField>
            <UButton
              class="w-min mt-5 block cursor-pointer"
              label="Save New Username"
              type="submit"
              :disabled="isUpdateUsernameButtonDisabled"
            />
          </UForm>
        </div>
      </div>
      <div class="flex flex-col mt-10 w-full max-w-[800px]">
        <h2 class="text-2xl">Change password</h2>
        <UForm
          class="mt-5"
          :schema="updatePasswordSchema"
          :state="updatePasswordState"
          @submit.prevent="updatePassword"
        >
          <UFormField
            name="oldPassword"
            class="w-full"
            label="Write your old password"
          >
            <UInput
              class="w-full"
              name="oldPassword"
              placeholder="Old password"
              v-model="updatePasswordState.oldPassword"
              type="password"
            />
          </UFormField>
          <UFormField
            name="newPassword"
            class="mt-5 w-full"
            label="Write your new password"
          >
            <UInput
              name="newPassword"
              placeholder="New password"
              v-model="updatePasswordState.newPassword"
              class="w-full"
              type="password"
            />
          </UFormField>
          <UFormField
            name="confirmNewPassword"
            class="mt-5 w-full"
            label="Confirm your new password"
          >
            <UInput
              name="confirmNewPassword"
              placeholder="Confirm new password"
              v-model="updatePasswordState.confirmNewPassword"
              class="w-full"
              type="password"
            />
          </UFormField>

          <UButton label="Update password" type="submit" class="mt-5" />
        </UForm>
      </div>

      <div class="mt-10">
        <h2 class="text-red-600">Danger zone</h2>
        <UButton
          label="Delete account"
          class="bg-red-600 mt-5 hover:bg-red-600 cursor-pointer active:bg-red-600"
          active-class="bg-red-600"
          @click="showDeleteAccountModal"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useAppStore } from "~/store/app-store";
import type { GetUserInfoResponseInterface } from "~/store/auth/interfaces/get-user-data-response.interface";
import { useUserStore } from "~/store/auth/user.store";
import DeleteAccountModal from "~/components/settings/DeleteAccountModal.vue";
import { z } from "zod";
import ConfirmYourNewEmailModal from "~/components/settings/ConfirmYourNewEmailModal.vue";

const isUpdateEmailButtonDisabled = computed(
  () => oldUserData.value.email === user.value.email,
);
const isUpdateUsernameButtonDisabled = computed(
  () => oldUserData.value.username === user.value.username,
);

const updateUsernameFormSchema = z.object({
  username: z.string().trim().min(6).max(50),
});

const updateEmailUserSchema = z.object({
  email: z.email(),
});

const updatePasswordSchema = z
  .object({
    oldPassword: z.string().trim().min(8).max(50),
    newPassword: z.string().trim().min(8).max(50),
    confirmNewPassword: z.string().trim().min(8).max(50),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Password do not match",
    path: ["confirmNewPassword"],
  });

const updatePasswordState = ref({
  oldPassword: "",
  newPassword: "",
  confirmNewPassword: "",
});

const toast = useToast();

const appStore = useAppStore();

const userStore = useUserStore();

const oldUserData = ref<GetUserInfoResponseInterface>({
  username: "",
  email: "",
});

const user = ref<GetUserInfoResponseInterface>({
  username: "",
  email: "",
});

const isDeleteAccountModalShow = ref(false);
const isDeleteAccountModalLoading = ref(false);

const isConfirmNewEmailModalShow = ref(false);

function showDeleteAccountModal() {
  isDeleteAccountModalShow.value = true;
}

async function updatePassword() {
  await userStore.updatePassword(
    updatePasswordState.value.oldPassword,
    updatePasswordState.value.newPassword,
    updatePasswordState.value.confirmNewPassword,
  );

  if (userStore.isError) {
    toast.add({
      title: "Error",
      description: userStore.errorMessage,
      progress: {
        color: "error",
      },
    });
  } else {
    toast.add({
      title: "Success",
      description: "Password changed success",
      progress: {
        color: "success",
      },
    });
  }
}

async function getUser() {
  const data = await userStore.getUserInfo();

  if (data) {
    user.value.username = data.username;
    user.value.email = data.email;

    oldUserData.value.username = data.username;
    oldUserData.value.email = data.email;
  }
}

async function updateUsername() {
  await userStore.updateUsername(user.value.username);

  if (userStore.isError) {
    toast.add({
      title: "Error",
      description: userStore.errorMessage,
      progress: {
        color: "error",
      },
    });
  } else {
    oldUserData.value.username = user.value.username;

    toast.add({
      title: "Success",
      description: "Username updated success",
      progress: {
        color: "success",
      },
    });
  }
}

async function updateEmail() {
  await userStore.updateEmail(user.value.email);

  isConfirmNewEmailModalShow.value = true;

  if (userStore.isError) {
    toast.add({
      title: "Error",
      description: userStore.errorMessage,
      progress: {
        color: "error",
      },
    });
  } else {
    oldUserData.value.email = user.value.email;
  }
}

async function deleteAccount() {
  isDeleteAccountModalLoading.value = true;

  await userStore.deleteAccount();

  isDeleteAccountModalLoading.value = false;
  isDeleteAccountModalShow.value = false;
}

onMounted(() => {
  appStore.setIsLoading(true);

  getUser().then(() => {
    appStore.setIsLoading(false);
  });
});
</script>
