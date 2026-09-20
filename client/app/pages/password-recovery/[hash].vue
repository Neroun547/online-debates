<template>
  <div class="w-full">
    <h2 class="text-center mt-25 font-bold text-2xl">
      {{ $t("password-recovery.title") }}
    </h2>
    <div class="flex justify-center max-sm:p-5">
      <BaseUserCredentialsForm
        class="max-w-[400px] w-full mt-10"
        :form-schema="formSchema"
        :fields="formFields"
        :error-message="errorMessage"
        :is-error="isError"
        :is-success="isSuccess"
        :is-form-loading="isFormLoading"
        :submit-button-text="$t('password-recovery.submit')"
        :success-message="$t('password-recovery.successMessage')"
        @submit-form="(data) => updatePassword(data)"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import BaseUserCredentialsForm from "~/components/BaseUserCredentialsForm.vue";
import type { PropsFieldItemInterface } from "~/components/BaseUserCredentialsForm.vue";
import { useUserStore } from "~/store/user/user.store";
import z from "zod";
import { useAppStore } from "~/store/app-store";

const { t } = useI18n();

const formFields = computed<Array<PropsFieldItemInterface>>(() => [
  {
    name: "password",
    placeholder: t("password-recovery.newPassword"),
    type: "password",
    htmlTag: "input",
    label: t("password-recovery.newPassword"),
  },
]);
const formSchema = z.object({
  password: z.string().min(8).max(50),
});

const errorMessage = ref("");
const isError = ref(false);

const isFormLoading = ref(false);

const isSuccess = ref(false);

const route = useRoute();
const userStore = useUserStore();
const appStore = useAppStore();

async function updatePassword(data: { password: string }) {
  clearErrorAndSuccessState();

  isFormLoading.value = true;

  await userStore.passwordRecovery(data.password, String(route.params.hash));

  if (userStore.isError) {
    isError.value = true;
    errorMessage.value = userStore.errorMessage ?? t("password-recovery.error");
  } else {
    isSuccess.value = true;

    window.location.href = "/auth";
  }
  isFormLoading.value = false;
}

function clearErrorAndSuccessState() {
  isSuccess.value = false;
  isError.value = false;
  errorMessage.value = "";
}

onMounted(() => {
  appStore.setIsLoading(false);
});
</script>
