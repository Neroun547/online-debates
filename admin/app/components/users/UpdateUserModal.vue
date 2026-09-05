<script setup lang="ts">
import * as zod from 'zod'

interface Props {
  username: string
  email: string
  timezone: string
}

interface UpdateUserFormData {
  username: string
  email: string
  password: string
  timezone: string
}

interface TimezoneOption {
  name: string
  value: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  close: [data: UpdateUserFormData | false]
}>()

const timezoneNames = Intl.supportedValuesOf('timeZone')
const timezones: TimezoneOption[] = timezoneNames.map(timezone => ({
  name: timezone,
  value: timezone
}))

const formSchema = zod.object({
  username: zod.string().trim().min(6).max(50),
  email: zod.string().trim().email(),
  password: zod
    .string()
    .max(50)
    .refine(password => password.length === 0 || password.length >= 8, {
      message: 'Password must contain at least 8 characters'
    }),
  timezone: zod
    .string()
    .refine(timezone => timezoneNames.includes(timezone), {
      message: 'Select a valid timezone'
    })
})

const formState = reactive<UpdateUserFormData>({
  username: '',
  email: '',
  password: '',
  timezone: ''
})

function submitForm() {
  emit('close', {
    username: formState.username.trim(),
    email: formState.email.trim(),
    password: formState.password,
    timezone: formState.timezone
  })
}

watch(
  props,
  () => {
    formState.username = props.username
    formState.email = props.email
    formState.password = ''
    formState.timezone = props.timezone
  },
  { immediate: true }
)
</script>

<template>
  <UModal title="Update user">
    <template #body>
      <UForm
        :schema="formSchema"
        :state="formState"
        @submit="submitForm"
      >
        <UFormField
          label="Username"
          name="username"
          class="w-full"
        >
          <UInput
            v-model="formState.username"
            name="username"
            placeholder="Username"
            autocomplete="username"
            :maxlength="50"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Email"
          name="email"
          class="mt-5 w-full"
        >
          <UInput
            v-model="formState.email"
            name="email"
            type="email"
            placeholder="Email"
            autocomplete="email"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Password"
          name="password"
          class="mt-5 w-full"
        >
          <UInput
            v-model="formState.password"
            name="password"
            type="password"
            placeholder="Leave blank to keep the current password"
            autocomplete="new-password"
            :maxlength="50"
            class="w-full"
          />
        </UFormField>

        <UFormField
          label="Timezone"
          name="timezone"
          class="mt-5 w-full"
        >
          <USelectMenu
            v-model="formState.timezone"
            :items="timezones"
            value-key="value"
            label-key="name"
            placeholder="Select timezone"
            :search-input="{ placeholder: 'Search timezone...' }"
            class="w-full"
          >
            <template #empty>
              <span>No timezones found</span>
            </template>
          </USelectMenu>
        </UFormField>

        <USeparator class="my-5" />

        <div class="flex justify-end">
          <UButton
            type="button"
            label="Cancel"
            color="error"
            class="mr-3 cursor-pointer"
            @click="emit('close', false)"
          />
          <UButton
            type="submit"
            label="Update"
            class="cursor-pointer"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
