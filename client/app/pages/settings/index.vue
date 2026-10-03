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

    <h2 class="text-4xl max-md:text-2xl">{{ $t("settings.title") }}</h2>
    <div class="mt-5">
      <UploadAvatar />
    </div>
    <section
      class="relative mt-10 overflow-hidden border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <div
        class="relative flex items-center gap-4 border-b border-gray-100 px-6 py-5 dark:border-gray-800 max-sm:px-4"
      >
        <div
          class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
        >
          <UIcon name="lucide:user-round-pen" class="size-5" />
        </div>
        <div>
          <h2 class="text-2xl font-semibold max-md:text-xl">
            {{ $t("settings.aboutMySelf") }}
          </h2>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {{ $t("settings.describeYourself") }}
          </p>
        </div>
      </div>

      <UForm
        :schema="aboutMySelfFormSchema"
        :state="aboutMySelfFormState"
        @submit.prevent="saveInfoAboutMySelf"
      >
        <div class="flex flex-col p-5">
          <div class="flex items-center">
            <UFormField
              name="age"
              :label="$t('settings.age')"
              class="w-[150px]"
            >
              <UInputNumber
                v-model="aboutMySelfFormState.age"
                :step="1"
                name="age"
                class="w-full"
              />
            </UFormField>

            <UFormField
              name="sex"
              :label="$t('settings.sex')"
              class="w-[150px] ml-5"
            >
              <SexSelect
                v-model:selected-sex="aboutMySelfFormState.sex"
                name="sex"
              />
            </UFormField>
          </div>

          <UFormField
            name="description"
            :label="$t('settings.describeYourself')"
            class="min-w-0 w-full mt-5"
          >
            <UTextarea
              v-model="aboutMySelfFormState.description"
              name="description"
              autoresize
              class="w-full"
              :rows="7"
              :maxlength="5000"
            />
            <div class="mt-2 flex justify-end text-xs text-gray-400">
              {{ aboutMySelfFormState.description.length }} / 5000
            </div>
          </UFormField>
        </div>

        <div class="ml-auto w-min mr-6 mb-6">
          <UButton
            :label="$t('settings.save')"
            class="w-min cursor-pointer"
            type="submit"
          />
        </div>
      </UForm>
    </section>
    <div class="flex flex-col shadow border border-default p-5 mt-10">
      <div class="flex justify-between max-md:flex-col">
        <div class="flex flex-col w-full mr-5">
          <div class="w-full">
            <h2 class="text-2xl max-md:text-xl">
              {{ $t("settings.personalInfo") }}
            </h2>
            <UForm
              class="mt-5"
              @submit.prevent="updateUserPersonalInfo"
              :state="user"
              :schema="updateEmailUserSchema"
            >
              <UFormField name="email" :label="$t('settings.email')">
                <UInput
                  :placeholder="$t('settings.email')"
                  class="w-full"
                  v-model="user.email"
                  name="email"
                />
              </UFormField>
              <UFormField
                :label="$t('settings.username')"
                name="username"
                class="mt-5 w-full"
              >
                <UInput
                  :placeholder="$t('settings.username')"
                  class="w-full"
                  v-model="user.username"
                  name="username"
                />
              </UFormField>
              <UFormField
                :label="$t('settings.timezone')"
                name="timezone"
                class="mt-5 w-full"
              >
                <TimezoneSelect v-model="user.timezone" />
              </UFormField>
              <UFormField
                :label="$t('settings.availableForPermanentSessions')"
                name="isAvailableForPermanentSessions"
                class="mt-5 w-full"
              >
                <USwitch
                  v-model="user.isAvailableForPermanentSessions"
                  color="success"
                />
                <p class="italic mt-5 text-xs">
                  {{ $t("settings.permanentSessionsDescription") }}
                </p>
              </UFormField>

              <div class="mt-5">
                <label for="" class="text-sm font-bold">
                  {{ $t("settings.language") }}
                </label>
                <LanguageSelect class="mt-2" />
              </div>

              <UButton
                class="w-min mt-5 block cursor-pointer max-sm:text-xs"
                :label="$t('settings.savePersonalData')"
                type="submit"
              />
            </UForm>
          </div>
        </div>
        <div class="flex flex-col w-full ml-5 max-md:ml-0 max-md:mt-10">
          <h2 class="text-2xl max-sm:text-xl">
            {{ $t("settings.changePassword") }}
          </h2>
          <UForm
            class="mt-5"
            :schema="updatePasswordSchema"
            :state="updatePasswordState"
            @submit.prevent="updatePassword"
          >
            <UFormField
              name="oldPassword"
              class="w-full"
              :label="$t('settings.enterOldPassword')"
            >
              <UInput
                class="w-full"
                name="oldPassword"
                :placeholder="$t('settings.oldPassword')"
                v-model="updatePasswordState.oldPassword"
                type="password"
              />
            </UFormField>
            <UFormField
              name="newPassword"
              class="mt-5 w-full"
              :label="$t('settings.enterNewPassword')"
            >
              <UInput
                name="newPassword"
                :placeholder="$t('settings.newPassword')"
                v-model="updatePasswordState.newPassword"
                class="w-full"
                type="password"
              />
            </UFormField>
            <UFormField
              name="confirmNewPassword"
              class="mt-5 w-full"
              :label="$t('settings.confirmNewPassword')"
            >
              <UInput
                name="confirmNewPassword"
                :placeholder="$t('settings.confirmNewPasswordPlaceholder')"
                v-model="updatePasswordState.confirmNewPassword"
                class="w-full"
                type="password"
              />
            </UFormField>

            <UButton
              :label="$t('settings.updatePassword')"
              type="submit"
              class="mt-5 max-sm:text-xs"
            />
          </UForm>
        </div>
      </div>

      <div class="mt-10">
        <h2 class="text-red-600">{{ $t("settings.dangerZone") }}</h2>
        <UButton
          :label="$t('settings.deleteAccount')"
          class="bg-red-600 mt-5 hover:bg-red-600 cursor-pointer active:bg-red-600 max-sm:text-xs"
          active-class="bg-red-600"
          @click="showDeleteAccountModal"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from "~/store/app-store";
import type { GetUserInfoResponseInterface } from "~/store/user/interfaces/get-user-data-response.interface";
import { useUserStore } from "~/store/user/user.store";
import DeleteAccountModal from "~/components/settings/DeleteAccountModal.vue";
import { z } from "zod";
import ConfirmYourNewEmailModal from "~/components/settings/ConfirmYourNewEmailModal.vue";
import UploadAvatar from "~/components/settings/UploadAvatar.vue";

const { t } = useI18n();

const aboutMySelfFormSchema = z.object({
  age: z.number().int().min(1).max(130),
  description: z.string().max(5000),
});

const aboutMySelfFormState = reactive<{
  age: number;
  description: string;
  sex: "male" | "female";
}>({
  age: 18,
  description: "",
  sex: "male",
});

const updateEmailUserSchema = z.object({
  email: z.string().email(),
  username: z.string().trim().min(6).max(50),
  timezone: z.string(),
  isAvailableForPermanentSessions: z.boolean(),
});

const updatePasswordSchema = computed(() =>
  z
    .object({
      oldPassword: z.string().trim().min(8).max(50),
      newPassword: z.string().trim().min(8).max(50),
      confirmNewPassword: z.string().trim().min(8).max(50),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: t("settings.passwordsDoNotMatch"),
      path: ["confirmNewPassword"],
    }),
);

const updatePasswordState = ref({
  oldPassword: "",
  newPassword: "",
  confirmNewPassword: "",
});

const toast = useToast();

const appStore = useAppStore();

const userStore = useUserStore();

const user = ref<GetUserInfoResponseInterface>({
  username: "",
  email: "",
  timezone: "",
  isAvailableForPermanentSessions: true,
  description: "",
  age: 14,
  sex: "male",
});

const isDeleteAccountModalShow = ref(false);
const isDeleteAccountModalLoading = ref(false);

const isConfirmNewEmailModalShow = ref(false);

function showDeleteAccountModal() {
  isDeleteAccountModalShow.value = true;
}

async function saveInfoAboutMySelf() {
  await userStore.updateUserAboutInfo({
    age: aboutMySelfFormState.age,
    description: aboutMySelfFormState.description,
    sex: aboutMySelfFormState.sex
  });

  if (userStore.isError) {
    toast.add({
      title: t("settings.error"),
      description: userStore.errorMessage,
      color: "error",
    });
  } else {
    toast.add({
      title: t("settings.success"),
      description: t("settings.infoAboutMySelfUpdatedSuccessfully"),
      color: "success",
    });
  }
}

async function updatePassword() {
  await userStore.updatePassword(
    updatePasswordState.value.oldPassword,
    updatePasswordState.value.newPassword,
    updatePasswordState.value.confirmNewPassword,
  );

  if (userStore.isError) {
    toast.add({
      title: t("settings.error"),
      description: userStore.errorMessage,
      progress: {
        color: "error",
      },
    });
  } else {
    toast.add({
      title: t("settings.success"),
      description: t("settings.passwordChangedSuccessfully"),
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
    user.value.timezone = data.timezone;
    user.value.isAvailableForPermanentSessions =
      data.isAvailableForPermanentSessions;

    aboutMySelfFormState.age = data.age;
    aboutMySelfFormState.description = data.description ? data.description : "";
    aboutMySelfFormState.sex = data.sex;
  }
}

async function updateUserPersonalInfo() {
  const result = await userStore.updateUserPersonalInfo({
    username: user.value.username,
    email: user.value.email,
    timezone: user.value.timezone,
    isAvailableForPermanentSessions: user.value.isAvailableForPermanentSessions,
  });

  isConfirmNewEmailModalShow.value = result.isMailSent;

  if (!result.isMailSent && !userStore.isError) {
    toast.add({
      title: t("settings.success"),
      description: t("settings.personalDataUpdatedSuccessfully"),
      progress: {
        color: "success",
      },
    });
  }
  if (userStore.isError) {
    toast.add({
      title: t("settings.error"),
      description: userStore.errorMessage,
      progress: {
        color: "error",
      },
    });
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
