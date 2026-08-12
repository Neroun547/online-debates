<template>
  <div class="w-full">
    <h2 class="text-center mt-25 font-bold text-2xl">Log in</h2>
    <div class="flex justify-center max-sm:p-5">
      <BaseUserCredentialsForm
        class="max-w-[400px] w-full mt-10"
        :form-schema="formSchema"
        :fields="fields"
        submit-button-text="Log in"
        @submit-form="(state: AuthRequestInterface) => auth(state)"
        :is-error="isAuthError"
        :error-message="authErrorMessage"
        :is-success="isFormSubmittedSuccess"
        success-message="Log in successful"
      >
        <template v-slot:footerLinks>
          <p>
            Don't have an account ?
            <ULink to="/signup" class="text-primary hover:text-primary"
              >Sign up</ULink
            >
          </p>
        </template>
      </BaseUserCredentialsForm>
    </div>
  </div>
</template>
<script setup lang="ts">
import { z } from "zod";
import type { PropsFieldItemInterface } from "~/components/BaseUserCredentialsForm.vue";
import BaseUserCredentialsForm from "~/components/BaseUserCredentialsForm.vue";
import type { AuthRequestInterface } from "~/store/user/interfaces/auth-request.interface";
import { useUserStore } from "~/store/user/user.store";

const userStore = useUserStore();

const isFormLoading = ref(false);

const formSchema = z.object({
  usernameOrEmail: z.string().trim().max(256).min(1),
  password: z.string().trim().min(8).max(50),
});

const isFormSubmittedSuccess = ref(false);
const isAuthError = ref(false);
const authErrorMessage = ref<string | undefined>(undefined);

const fields: Array<PropsFieldItemInterface> = [
  {
    name: "usernameOrEmail",
    placeholder: "Username or email address",
    type: "text",
    htmlTag: "input",
    label: "Your username or email address",
  },
  {
    name: "password",
    placeholder: "Password",
    type: "password",
    htmlTag: "input",
    label: "Your password",
  },
];

async function auth(state: AuthRequestInterface) {
  isFormLoading.value = true;

  await userStore.auth({
    usernameOrEmail: state.usernameOrEmail,
    password: state.password,
  });

  if (!userStore.isError) {
    authErrorMessage.value = "";
    isFormSubmittedSuccess.value = true;
    isAuthError.value = false;

    window.location.href = "/";
  } else {
    authErrorMessage.value = userStore.errorMessage;
    isFormSubmittedSuccess.value = false;
    isAuthError.value = true;
  }
  isFormLoading.value = false;
}
</script>
