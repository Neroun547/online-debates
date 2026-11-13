<template>
	<div>
		<USelect v-model="selectedLanguage" :items="languageSelectItems" />
	</div>
</template>

<script setup lang="ts">
import { useUserStore } from "~/store/user/user.store";

const userStore = useUserStore();
const { setLocale, locale } = useI18n();

const selectedLanguage = ref<"en" | "uk" | "ru">("en");

const languageSelectItems = [
	{
		label: "Ukrainian",
		value: "uk"
	},
	{
		label: "Russian",
		value: "ru"
	},
	{
		label: "English",
		value: "en"
	}
];

watch(selectedLanguage, (newValue: "en" | "uk" | "ru") => {
	setLocale(newValue);

	if (userStore.isAuth) {
		userStore.updateUserLanguage(newValue);
	}
});

onMounted(() => {
	selectedLanguage.value = locale.value;
});
</script>
