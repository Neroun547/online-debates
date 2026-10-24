<template>
	<div class="w-full">
		<h2 class="text-center mt-25 font-bold text-2xl">
			{{ $t("auth.title") }}
		</h2>
		<div class="flex justify-center max-sm:p-5">
			<BaseUserCredentialsForm
				class="max-w-[400px] w-full mt-10"
				:form-schema="formSchema"
				:fields="fields"
				:submit-button-text="$t('auth.submit')"
				:is-error="isAuthError"
				:error-message="authErrorMessage"
				:is-success="isFormSubmittedSuccess"
				:success-message="$t('auth.successMessage')"
				@submit-form="(state: AuthRequestInterface) => auth(state)"
			>
				<template #footerLinks>
					<p>
						{{ $t("auth.noAccount") }}
						<ULink
to="/signup"
class="text-primary hover:text-primary"
>
							{{ $t("auth.signUp") }}
						</ULink>
					</p>
					<p class="mt-3">
						{{ $t("auth.forgotPassword") }}
						<ULink
							to="/forget-password"
							class="text-primary hover:text-primary"
						>
							{{ $t("auth.passwordRecovery") }}
						</ULink>
					</p>
				</template>
			</BaseUserCredentialsForm>
		</div>
	</div>
</template>

<script setup lang="ts">
import { z } from "zod"
import type { PropsFieldItemInterface } from "~/components/BaseUserCredentialsForm.vue"
import BaseUserCredentialsForm from "~/components/BaseUserCredentialsForm.vue"
import { useAppStore } from "~/store/app-store"
import type { AuthRequestInterface } from "~/store/user/interfaces/auth-request.interface"
import { useUserStore } from "~/store/user/user.store"
import { redirectAuthUser } from "~/utils/redirect-auth-user"

const { setLocale } = useI18n()

const appStore = useAppStore()
const userStore = useUserStore()
const { t } = useI18n()

const isFormLoading = ref(false)

const formSchema = z.object({
	usernameOrEmail: z.string().trim().max(256).min(1),
	password: z.string().trim().min(8).max(50)
})

const isFormSubmittedSuccess = ref(false)
const isAuthError = ref(false)
const authErrorMessage = ref<string | undefined>(undefined)

const fields = computed<Array<PropsFieldItemInterface>>(() => [
	{
		name: "usernameOrEmail",
		placeholder: t("auth.usernameOrEmailPlaceholder"),
		type: "text",
		htmlTag: "input",
		label: t("auth.usernameOrEmailLabel")
	},
	{
		name: "password",
		placeholder: t("auth.password"),
		type: "password",
		htmlTag: "input",
		label: t("auth.passwordLabel")
	}
])

async function auth(state: AuthRequestInterface) {
	isFormLoading.value = true

	const response = await userStore.auth({
		usernameOrEmail: state.usernameOrEmail,
		password: state.password
	})
	if (!userStore.isError) {
		if (response?.language) {
			// @ts-ignore
			setLocale(response.language)
		}
		authErrorMessage.value = ""
		isFormSubmittedSuccess.value = true
		isAuthError.value = false

		window.location.href = "/home"
	} else {
		authErrorMessage.value = userStore.errorMessage
		isFormSubmittedSuccess.value = false
		isAuthError.value = true
	}
	isFormLoading.value = false
}

onMounted(() => {
	appStore.setIsLoading(false)

	redirectAuthUser()
})
</script>
