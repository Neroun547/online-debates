<template>
	<UForm
		:schema="props.formSchema"
		:state="formState"
		class="shadow p-5 w-max"
		@submit="(e: Event) => submitForm(e)"
	>
		<UFormField
			v-for="(value, index) in props.fields"
			:label="value.label"
			:class="index >= 1 ? 'mt-5' : ''"
			:name="value.name"
		>
			<UInput
				v-if="value.htmlTag === 'input'"
				v-model="formState[value.name]"
				:placeholder="value.placeholder"
				:name="value.name"
				:type="value.type"
				class="w-full"
			/>
			<UInputNumber
				v-if="value.htmlTag === 'numberInput'"
				v-model="formState[value.name]"
				:placeholder="value.placeholder"
				:name="value.name"
				class="w-full"
				:min="18"
			/>
			<UTextarea
				v-if="value.htmlTag === 'textarea'"
				v-model="formState[value.name]"
				:placeholder="value.placeholder"
				:name="value.name"
				class="w-full"
				autoresize
			/>
			<TimezoneSelect
				v-if="value.htmlTag === 'select' && value.type === 'timezone'"
				v-model="formState[value.name]"
			/>
			<SexSelect
				v-if="value.htmlTag === 'select' && value.type === 'sex'"
				v-model:selected-sex="formState[value.name]"
			/>
		</UFormField>

		<UAlert
			v-if="props.isError"
			variant="outline"
			:description="props.errorMessage"
			class="mt-5 text-center"
			color="error"
		/>

		<UAlert
			v-if="props.isSuccess"
			variant="outline"
			:description="props.successMessage"
			class="mt-5 text-center"
			color="success"
		/>

		<UButton
			:label="props.submitButtonText"
			class="mt-5 ml-auto mr-auto w-full cursor-pointer"
			type="submit"
			block
			:loading="props.isFormLoading"
		/>

		<footer class="mt-5">
			<slot name="footerLinks" />
		</footer>
	</UForm>
</template>

<script setup lang="ts">
import type { z } from "zod";

export interface PropsFieldItemInterface {
	name: string;
	placeholder: string;
	type: "text" | "password" | "email" | "timezone" | "number" | "sex";
	htmlTag: "input" | "select" | "textarea" | "numberInput";
	label: string;
}

interface Props {
	fields: Array<PropsFieldItemInterface>;
	formSchema: z.AnyZodObject;
	submitButtonText: string;
	isError: boolean;
	errorMessage: string | undefined;
	isSuccess: boolean;
	successMessage: string | undefined;
	isFormLoading?: boolean;
	defaultValues?: { [key: string]: number | string };
}

const props = defineProps<Props>();
const formState = ref<any>({});

const emit = defineEmits(["submitForm"]);

function submitForm(e: Event) {
	e.preventDefault();

	emit("submitForm", formState.value);
}

watchEffect(() => {
	if (props.fields && props.fields.length) {
		const accumulator: any = {};

		for (let i = 0; i < props.fields.length; i++) {
			const field = props.fields[i];

			if (field) {
				accumulator[field.name] = props.defaultValues?.[field.name] ?? "";
			}
		}
		formState.value = accumulator;
	}
});
</script>
