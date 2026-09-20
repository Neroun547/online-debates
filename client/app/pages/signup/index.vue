<template>
  <div class="w-full">
    <h2 class="text-center mt-25 font-bold text-2xl">
      {{ $t("signup.title") }}
    </h2>
    <div class="flex justify-center max-sm:p-5">
      <BaseUserCredentialsForm
        class="max-w-[400px] w-full mt-10"
        :fields="fields"
        :form-schema="formSchema"
        :is-error="isSignupError"
        :error-message="signupErrorMessage"
        :is-success="isFormSubmittedSuccess"
        :success-message="$t('signup.successMessage')"
        :submit-button-text="$t('signup.submit')"
        :is-form-loading="isFormLoading"
        @submit-form="(data: SignupRequestInterface) => signup(data)"
      >
        <template v-slot:footerLinks>
          <p>
            {{ $t("signup.alreadyHaveAccount") }}
            <ULink to="/auth" class="text-primary hover:text-primary">
              {{ $t("signup.signIn") }}
            </ULink>
          </p>
        </template>
      </BaseUserCredentialsForm>
    </div>
  </div>
</template>
<script setup lang="ts">
import type { PropsFieldItemInterface } from "~/components/BaseUserCredentialsForm.vue";
import { z } from "zod";
import { useUserStore } from "~/store/user/user.store";
import type { SignupRequestInterface } from "~/store/user/interfaces/signup-request.interface";
import { useAppStore } from "~/store/app-store";
import { redirectAuthUser } from "~/utils/redirect-auth-user";

const isFormLoading = ref(false);

const appStore = useAppStore();
const userStore = useUserStore();
const { t } = useI18n();

const isFormSubmittedSuccess = ref(false);
const isSignupError = ref(false);
const signupErrorMessage = ref<string | undefined>(undefined);

const fields = computed<Array<PropsFieldItemInterface>>(() => [
  {
    name: "email",
    placeholder: t("signup.email"),
    type: "text",
    htmlTag: "input",
    label: t("signup.email"),
  },
  {
    name: "username",
    placeholder: t("signup.username"),
    type: "text",
    htmlTag: "input",
    label: t("signup.username"),
  },
  {
    name: "password",
    placeholder: t("signup.password"),
    type: "password",
    htmlTag: "input",
    label: t("signup.password"),
  },
  {
    name: "timezone",
    placeholder: t("signup.timezone"),
    type: "timezone",
    htmlTag: "select",
    label: t("signup.timezone"),
  },
]);

const formSchema = z.object({
  username: z.string().trim().min(6).max(50),
  email: z.string().email(),
  password: z.string().trim().min(8).max(50),
  timezone: z.string().min(1).max(50),
});

async function signup(data: SignupRequestInterface) {
  isFormLoading.value = true;

  await userStore.signup(data);

  if (!userStore.isError) {
    isFormSubmittedSuccess.value = true;
    isSignupError.value = false;
    signupErrorMessage.value = "";
  } else {
    isFormSubmittedSuccess.value = false;
    isSignupError.value = true;
    signupErrorMessage.value = userStore.errorMessage;
  }
  isFormLoading.value = false;
}

onMounted(() => {
  appStore.setIsLoading(false);

  redirectAuthUser();
});
</script>
