<template>
	<div class="mt-10">
		<div v-if="isConfirmAccountSuccess" class="p-5">
			<h2>Redirecting ...</h2>
		</div>
		<div v-if="isConfirmAccountError" class="p-5">
			{{ confirmErrorText }}
		</div>
	</div>
</template>

<script setup>
import { useUserStore } from "~/store/user/user.store";

const route = useRoute();
const userStore = useUserStore();

const isConfirmAccountError = ref(false);
const isConfirmAccountSuccess = ref(false);

const confirmErrorText = ref("");

onMounted(() => {
	userStore
		.confirmAccount(route.params.hash)
		.then(() => {
			if (userStore.isError) {
				isConfirmAccountError.value = true;
				isConfirmAccountSuccess.value = false;

				confirmErrorText.value = userStore.errorMessage;
			} else {
				isConfirmAccountError.value = false;
				isConfirmAccountSuccess.value = true;
				window.location.href = "/auth";
			}
		})
		.catch(() => {
			isConfirmAccountError.value = true;
			isConfirmAccountSuccess.value = false;

			confirmErrorText.value = userStore.errorMessage;
		});
});
</script>
