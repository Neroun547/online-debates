<template>
	<div class="w-full">
		<h2 class="text-center mt-25 font-bold text-2xl">
			{{ $t("forget-password.title") }}
		</h2>
		<div class="flex justify-center max-sm:p-5">
			<BaseUserCredentialsForm
				class="max-w-[400px] w-full mt-10"
				:fields="formFields"
				:form-schema="formSchema"
				:submit-button-text="$t('forget-password.submit')"
				:is-error="isError"
				:error-message="errorMessage"
				:is-success="isSuccess"
				:success-message="$t('forget-password.successMessage')"
				:is-form-loading="isFormLoading"
				@submit-form="(data) => sendRecoveryLink(data)"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import BaseUserCredentialsForm, {
	type PropsFieldItemInterface
} from "~/components/BaseUserCredentialsForm.vue";
import z from "zod";
import { useUserStore } from "~/store/user/user.store";
import { useAppStore } from "~/store/app-store";

const userStore = useUserStore();
const appStore = useAppStore();
const { t } = useI18n();

const isError = ref<boolean>(false);
const errorMessage = ref<string>("");

const isSuccess = ref<boolean>(false);
const isFormLoading = ref<boolean>(false);

const formFields = computed<Array<PropsFieldItemInterface>>(() => [
	{
		name: "email",
		placeholder: t("forget-password.emailPlaceholder"),
		type: "email",
		htmlTag: "input",
		label: t("forget-password.email")
	}
]);

const formSchema = z.object({
	email: z.string().email()
});

async function sendRecoveryLink(data: { email: string }) {
	clearErrorAndSuccessState();
	isFormLoading.value = true;

	await userStore.sendPasswordRecoveryLink(data.email);

	if (userStore.isError) {
		isError.value = true;
		errorMessage.value = userStore.errorMessage ?? t("forget-password.error");
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
