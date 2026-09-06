<script setup lang="ts">
import * as zod from "zod";
import { useAuthStore } from "~/store/auth/auth.store";

const toast = useToast();

const authStore = useAuthStore();

const emailSchema = zod.object({
  email: zod.string().trim().email(),
});

const passwordSchema = zod
  .object({
    currentPassword: zod.string().min(8).max(50),
    newPassword: zod.string().min(8).max(50),
    confirmPassword: zod.string().min(8).max(50),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const emailFormState = reactive({
  email: "",
});

const passwordFormState = reactive({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const isEmailSchemaValid: ComputedRef<boolean> = computed(
  (): boolean => emailSchema.safeParse(emailFormState).success,
);
const isPasswordSchemaValid: ComputedRef<boolean> = computed(
  (): boolean => passwordSchema.safeParse(passwordFormState).success,
);

async function changeEmail(e: Event) {
  e.preventDefault();

  await authStore.changeEmail(emailFormState.email);

  if (authStore.isError) {
    toast.add({
      title: "Error",
      description: authStore.errorMessage,
      color: "error",
    });
  } else {
    toast.add({
      title: "Success",
      description: "Email updated successfully",
      color: "success",
    });
  }
}

async function changePassword(e: Event) {
  e.preventDefault();

  await authStore.changePassword({
    oldPassword: passwordFormState.currentPassword,
    newPassword: passwordFormState.newPassword,
    confirmNewPassword: passwordFormState.confirmPassword,
  });

  if (authStore.isError) {
    toast.add({
      title: "Error",
      description: authStore.errorMessage,
      color: "error",
    });
  } else {
    toast.add({
      title: "Success",
      description: "Password updated successfully",
      color: "success",
    });
  }
}

watch(
  () => authStore.email,
  (email) => {
    emailFormState.email = email;
  },
  { immediate: true },
);
</script>

<template>
  <div class="mx-auto w-full">
    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-highlighted">Account settings</h1>
      <p class="mt-1 text-sm text-muted">
        Manage the email and password of your administrator account.
      </p>
    </div>

    <div class="grid gap-6 lg:grid-cols-2">
      <UCard
        title="Change email"
        description="Enter the new email address for your account."
      >
        <UForm
          :schema="emailSchema"
          :state="emailFormState"
          @submit="changeEmail"
          class="space-y-5"
        >
          <UFormField label="Email" name="email" class="w-full">
            <UInput
              v-model="emailFormState.email"
              name="email"
              type="email"
              placeholder="admin@example.com"
              autocomplete="email"
              icon="lucide:mail"
              class="w-full"
            />
          </UFormField>

          <div class="flex justify-end">
            <UButton
              type="submit"
              label="Update email"
              icon="lucide:save"
              class="cursor-pointer"
              :disabled="!isEmailSchemaValid"
            />
          </div>
        </UForm>
      </UCard>

      <UCard
        title="Change password"
        description="Use a password containing between 8 and 50 characters."
      >
        <UForm
          :schema="passwordSchema"
          :state="passwordFormState"
          @submit="changePassword"
          class="space-y-5"
        >
          <UFormField
            label="Current password"
            name="currentPassword"
            class="w-full"
          >
            <UInput
              v-model="passwordFormState.currentPassword"
              name="currentPassword"
              type="password"
              placeholder="Current password"
              autocomplete="current-password"
              :maxlength="50"
              icon="lucide:lock-keyhole"
              class="w-full"
            />
          </UFormField>

          <UFormField label="New password" name="newPassword" class="w-full">
            <UInput
              v-model="passwordFormState.newPassword"
              name="newPassword"
              type="password"
              placeholder="New password"
              autocomplete="new-password"
              :maxlength="50"
              icon="lucide:key-round"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="Confirm new password"
            name="confirmPassword"
            class="w-full"
          >
            <UInput
              v-model="passwordFormState.confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm new password"
              autocomplete="new-password"
              :maxlength="50"
              icon="lucide:key-round"
              class="w-full"
            />
          </UFormField>

          <div class="flex justify-end">
            <UButton
              type="submit"
              label="Update password"
              icon="lucide:save"
              class="cursor-pointer"
              :disabled="!isPasswordSchemaValid"
            />
          </div>
        </UForm>
      </UCard>
    </div>
  </div>
</template>
