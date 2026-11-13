<script setup>
const props = defineProps({
	loading: {
		type: Boolean,
		default: false
	}
});

const isOpen = defineModel("isOpen", {
	type: Boolean,
	default: false,
	required: true
});

const emit = defineEmits(["close"]);

function confirm() {
	emit("close");
}
</script>

<template>
	<UModal v-model:open="isOpen" title="Confirm your new email address">
		<template #body>
			<p class="text-sm text-gray-700">
				Letter with confirmation link was sent to your new email.
			</p>
		</template>

		<template #footer>
			<div class="flex w-full justify-end gap-3">
				<UButton
					label="Ok"
					color="primary"
					class="cursor-pointer"
					@click="confirm"
				/>
			</div>
		</template>
	</UModal>
</template>
