<template>
	<div
		class="fixed inset-0 z-50 grid place-items-center"
		role="status"
		aria-live="polite"
		:aria-label="label"
	>
		<Loader />
	</div>
</template>

<script setup>
import Loader from "./Loader.vue"

defineProps({
	label: {
		type: String
	}
})
</script>
