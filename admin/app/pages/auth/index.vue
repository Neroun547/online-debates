<template>
  <div>
    <BaseUserCredentialsForm
      title="Log in"
      submit-button-label="Log in"
      :form-fields="formFields"
      v-model:form-state="formState"
      class="m-auto mt-50"
      @submit="auth"
      :show-error-message="isError"
      :error-message="errorMessage"
      :is-loading="isLoading"
      :show-success-message="isSuccess"
      :success-message="successMessage"
    />
  </div>
</template>
<script setup lang="ts">
import BaseUserCredentialsForm, {
  type FormFieldItem,
} from "~/components/BaseUserCredentialsForm.vue";
import { useAuthStore } from "../../../store/auth/auth.store";

const authStore = useAuthStore();

const isLoading = ref<boolean>(false);
const formState = ref({
  email: "",
  password: "",
});

const formFields: FormFieldItem[] = [
  {
    name: "email",
    value: "",
    type: "text",
    placeholder: "Email",
    label: "Email",
  },
  {
    name: "password",
    value: "",
    type: "password",
    placeholder: "Password",
    label: "Password",
  },
];

const isError = ref<boolean>(false);
const errorMessage = ref<string>("");

const isSuccess = ref<boolean>(false);
const successMessage = ref<string>("");

function clearSuccessAndErrorState() {
  isError.value = false;
  isSuccess.value = false;

  errorMessage.value = "";
  successMessage.value = "";
}

async function auth() {
  isLoading.value = true;

  clearSuccessAndErrorState();

  await authStore.auth({
    email: formState.value.email,
    password: formState.value.password,
  });

  isLoading.value = false;

  if (authStore.isError) {
    isError.value = true;
    errorMessage.value = authStore.errorMessage ?? "";
  } else {
    isSuccess.value = true;
    successMessage.value = "Auth success";
  }

  window.location.href = "/";
}
</script>
