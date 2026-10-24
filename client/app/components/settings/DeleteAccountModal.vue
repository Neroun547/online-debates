<script setup>
const props = defineProps({
	loading: {
		type: Boolean,
		default: false
	}
})

const isOpen = defineModel("isOpen", {
	type: Boolean,
	default: false,
	required: true
})

const emit = defineEmits(["close", "confirm"])

function cancel() {
	emit("close", false)
}

function confirm() {
	emit("confirm", true)
}
</script>

<template>
	<UModal
		v-model:open="isOpen"
		title="Delete account"
		description="This action cannot be undone."
	>
		<template #body>
			<p class="text-sm text-gray-700">
				Are you sure you want to delete your account?
			</p>
		</template>

		<template #footer>
			<div class="flex w-full justify-end gap-3">
				<UButton
					label="Cancel"
					color="neutral"
					variant="outline"
					@click="cancel"
				/>
				<UButton
					label="Delete account"
					color="error"
					:disabled="loading"
					:loading="loading"
					class="cursor-pointer"
					@click="confirm"
				/>
			</div>
		</template>
	</UModal>
</template>
