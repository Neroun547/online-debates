<template>
  <div class="mt-15">
    <div class="mx-auto max-w-3xl">
      <div class="mb-8 text-center">
        <div
          class="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary"
        >
          <UIcon name="lucide:mail" class="size-6" />
        </div>
        <h1 class="text-4xl font-semibold">Contact support</h1>
        <p class="mt-3 text-muted">
          Describe your question or problem and we will get back to you.
        </p>
      </div>

      <UCard class="mt-10">
        <UForm
          :schema="feedbackSchema"
          :state="formState"
          class="space-y-6"
          @submit="saveMessage"
        >
          <UFormField label="Email" name="email" required class="w-full">
            <UInput
              v-model="formState.email"
              name="email"
              placeholder="Email"
              class="w-full"
            />
          </UFormField>
          <UFormField label="Subject" name="subject" required class="w-full">
            <UInput
              v-model="formState.subject"
              name="subject"
              placeholder="What can we help you with?"
              :maxlength="150"
              class="w-full"
            />
          </UFormField>

          <UFormField
            label="Message"
            name="message"
            required
            :hint="`${formState.message.length}/5000`"
            class="w-full"
          >
            <UTextarea
              v-model="formState.message"
              name="message"
              placeholder="Write your message here..."
              :rows="8"
              :maxrows="16"
              :maxlength="5000"
              autoresize
              class="w-full"
            />
          </UFormField>

          <div class="flex justify-end">
            <UButton
              type="submit"
              label="Send message"
              icon="lucide:send"
              class="cursor-pointer"
            />
          </div>
        </UForm>
      </UCard>
    </div>
  </div>
</template>
<script setup lang="ts">
import { z } from "zod";
import { useAppStore } from "~/store/app-store";
import { useSupportStore } from "~/store/support/support.store";

const appStore = useAppStore();
const supportStore = useSupportStore();

const toast = useToast();

const feedbackSchema = z.object({
  email: z.email().trim(),
  subject: z.string().trim().min(1).max(150),
  message: z.string().trim().min(1).max(5000),
});

const formState = reactive({
  subject: "",
  message: "",
  email: "",
});

async function saveMessage(e: Event) {
  e.preventDefault();

  await supportStore.sendMessageToSupport({
    subject: formState.subject,
    message: formState.message,
    email: formState.email,
  });

  if (supportStore.isError) {
    toast.add({
      title: "Error",
      description: supportStore.errorMessage,
      color: "error",
    });
  } else {
    toast.add({
      title: "Sent successfully",
      description:
        "Your message sent successfully. We will write letter to your email",
      color: "success",
    });
  }
}

onMounted(() => {
  appStore.setIsLoading(false);
});
</script>
