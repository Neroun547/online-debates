<template>
  <div class="bg-blue-950 max-w-[500px] rounded p-5">
    <h2 class="font-bold text-center text-2xl">{{ props.title }}</h2>
    <UForm @submit="submitForm" :state="formState">
      <UFormField
        v-for="item in props.formFields"
        :label="item.label"
        class="w-full mt-5"
        :name="item.name"
      >
        <UInput
          class="w-full"
          v-if="item.type === 'text'"
          v-model="formState[item.name]"
          :placeholder="item.placeholder ? item.placeholder : ''"
        />
        <UInput
          class="w-full"
          v-if="item.type === 'password'"
          v-model="formState[item.name]"
          :placeholder="item.placeholder ? item.placeholder : ''"
          type="password"
        />
      </UFormField>

      <UButton
        type="submit"
        :label="props.submitButtonLabel"
        class="w-full mt-5"
        :ui="{ label: 'text-center w-full' }"
        :loading="props.isLoading"
      />
    </UForm>

    <UAlert
      v-if="props.showErrorMessage"
      :description="props.errorMessage"
      variant="soft"
      color="error"
      class="text-center mt-5"
    />

    <UAlert
      v-if="props.showSuccessMessage"
      :description="props.successMessage"
      variant="soft"
      color="success"
      class="text-center mt-5"
    />
  </div>
</template>
<script setup lang="ts">
interface Props {
  title: string;
  submitButtonLabel: string;
  formFields: FormFieldItem[];
  showErrorMessage: boolean;
  errorMessage: string;
  showSuccessMessage: boolean;
  successMessage: string;
  isLoading: boolean;
}

export interface FormFieldItem {
  name: string;
  value: string;
  placeholder?: string;
  label?: string;
  type: "text" | "password";
}

const props = defineProps<Props>();
const formState = defineModel<any>("formState");
const emit = defineEmits(["submit"]);

function submitForm(e: Event) {
  e.preventDefault();
  emit("submit", formState.value);
}
</script>
