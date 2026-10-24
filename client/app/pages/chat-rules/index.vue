<template>
	<div class="mt-15">
		<h2 class="font-bold text-4xl max-md:text-2xl">
			{{ $t("chatRules.title") }}
		</h2>
		<ul class="mt-15 list-disc">
			<li>{{ $t("chatRules.rules.first") }}</li>
		</ul>
	</div>
</template>

<script setup>
import { useAppStore } from "~/store/app-store"

const appStore = useAppStore()

onMounted(() => {
	appStore.setIsLoading(false)
})
</script>
