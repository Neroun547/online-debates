<template>
  <div class="w-full">
    <h2 class="text-center mt-25 font-bold text-2xl">
      Password recovery
    </h2>
    <div class="flex justify-center max-sm:p-5">
      <BaseUserCredentialsForm
        class="max-w-[400px] w-full mt-10"
        :fields="formFields"
        :form-schema="formSchema"
        submitButtonText="Send recovery link"
        :isError="isError"
        :errorMessage="errorMessage"
        :isSuccess="isSuccess"
        successMessage="Recovery link was sent to your email"
        :isFormLoading="isFormLoading"
        @submit-form="(data) => sendRecoveryLink(data)"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import BaseUserCredentialsForm, {
  type PropsFieldItemInterface,
} from "~/components/BaseUserCredentialsForm.vue";
import z from "zod";
import { useUserStore } from "~/store/user/user.store";
import { useAppStore } from "~/store/app-store";

const userStore = useUserStore();
const appStore = useAppStore();

const isError = ref<boolean>(false);
const errorMessage = ref<string>("");

const isSuccess = ref<boolean>(false);
const isFormLoading = ref<boolean>(false);

const formFields: Array<PropsFieldItemInterface> = [
  {
    name: "email",
    placeholder: "Enter account email",
    type: "email",
    htmlTag: "input",
    label: "Email",
  },
];

const formSchema = z.object({
  email: z.email(),
});

async function sendRecoveryLink(data: { email: string }) {
  clearErrorAndSuccessState();
  isFormLoading.value = true;

  await userStore.sendPasswordRecoveryLink(data.email);

  if (userStore.isError) {
    isError.value = true;
    errorMessage.value = userStore.errorMessage ?? "Error";
  } else {
    isSuccess.value = true;
  }
  isFormLoading.value = false;
}

function clearErrorAndSuccessState() {
  isError.value = false;
  errorMessage.value = "";
  isSuccess.value = false;
}

onMounted(() => {
  appStore.setIsLoading(false);
});
</script>
