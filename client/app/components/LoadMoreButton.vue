<template>
	<UButton
		class="bg-primary cursor-pointer"
		:loading="props.isLoading"
		@click="loadMore"
	>
		{{ $t("loadMore") }}
	</UButton>
</template>

<script setup>
const emit = defineEmits(["loadMore"]);
const props = defineProps(["isLoading"]);

function loadMore() {
	emit("loadMore");
}
</script>
