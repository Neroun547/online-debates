<template>
  <div class="mt-15"> 
    <UAlert
      v-if="isUserNewEmailConfirmedSuccess"
      title="Confirmed success"
      color="success"
      variant="outline"
    />
    <UAlert
      v-if="isUserNewEmailConfirmError"
      title="Confirm new email error"
      :description="userNewEmailErrorText"
      variant="outline"
      color="error"
    />
  </div>
</template>
<script setup>
import { useAppStore } from "~/store/app-store";
import { useUserStore } from "~/store/auth/user.store";

const route = useRoute();
const userStore = useUserStore();

const appStore = useAppStore();

const isUserNewEmailConfirmedSuccess = ref(false);
const isUserNewEmailConfirmError = ref(false);
const userNewEmailErrorText = ref("");

onMounted(async () => {
  isUserNewEmailConfirmError.value = false;
  isUserNewEmailConfirmedSuccess.value = false;

  await userStore.confirmNewEmail(route.params.hash);

  appStore.setIsLoading(false);

  if (userStore.isError) {
    isUserNewEmailConfirmError.value = true;
    userNewEmailErrorText.value = userStore.errorMessage;
  } else {
    isUserNewEmailConfirmedSuccess.value = true;

    // window.location.href = "/settings";
  }
});
</script>
