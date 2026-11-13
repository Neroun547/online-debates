<script setup lang="ts">
interface TimezoneOption {
	name: string;
	value: string;
}

interface Props {
	placeholder?: string;
	disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
	placeholder: "Select timezone",
	disabled: false
});

const selectedTimezone = defineModel<string | null>({ default: null });

const timezones: TimezoneOption[] = Intl.supportedValuesOf("timeZone").map(
	(timezoneName) => ({
		name: timezoneName,
		value: timezoneName
	})
);
</script>

<template>
	<USelectMenu
		v-model="selectedTimezone"
		:items="timezones"
		:placeholder="props.placeholder"
		:disabled="props.disabled"
		value-key="value"
		label-key="name"
		clear
		class="w-full"
		:search-input="{
			placeholder: 'Search timezone...'
		}"
	>
		<template #empty>
			<span>No timezones found</span>
		</template>
	</USelectMenu>
</template>
