<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <div
      class="flex-1 space-y-5 overflow-y-auto bg-slate-50/60 px-4 py-5"
      ref="listOfMessages"
    >
      <UButton
        v-if="props.isLoadMoreAvailable"
        type="button"
        label="Load more"
        icon="lucide:refresh-ccw"
        @click="emit('loadMore')"
      />

      <div v-for="(chatMessage, index) in props.messages" :key="index">
        <div v-if="chatMessage.isSender" class="flex justify-end">
          <div class="max-w-[78%]">
            <div
              class="rounded-2xl rounded-br-sm bg-sky-500 px-3.5 py-2.5 text-sm leading-5 text-white shadow-sm"
            >
              {{ chatMessage.content }}
              <div class="text-[10px]">
                {{ chatMessage.createdAt }}
              </div>
            </div>
          </div>
        </div>

        <div v-else class="flex justify-start">
          <div class="max-w-[78%]">
            <div
              class="rounded-2xl bg-gray-200 px-3.5 py-2.5 text-sm leading-5 text-black shadow-sm"
            >
              {{ chatMessage.content }}
              <div class="text-[10px]">
                {{ chatMessage.createdAt }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <form
      class="border-t border-slate-200 bg-white p-3"
      @submit.prevent="sendMessage"
    >
      <div
        class="flex items-end gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-100"
      >
        <textarea
          v-model="message"
          @keydown.enter.exact.prevent="sendMessage"
          rows="1"
          aria-label="Message"
          placeholder="Write a message..."
          class="max-h-28 min-h-9 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400"
          maxlength="5000"
        />
        <UButton
          type="submit"
          icon="lucide:send"
          aria-label="Send message"
          :disabled="!message.trim()"
          class="mb-0.5 shrink-0 cursor-pointer rounded-lg"
        />
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { SessionChatMessage } from "./types/session-chat.types";

interface Props {
  messages: SessionChatMessage[];
  isLoadMoreAvailable: boolean;
}

const props = defineProps<Props>();

const listOfMessages = useTemplateRef("listOfMessages");

const emit = defineEmits<{
  sendMessage: [message: string];
  loadMore: [];
}>();

const message = ref("");

function sendMessage() {
  const trimmedMessage = message.value.trim();

  if (!trimmedMessage) return;

  emit("sendMessage", trimmedMessage);
  message.value = "";
}

async function scrollToMessagesBottom() {
  await nextTick();
  listOfMessages.value?.scrollTo({ top: listOfMessages.value?.scrollHeight });
}

watch(
  () => props.messages,
  (newValue, oldValue) => {
    if (newValue.length > oldValue.length) {
      scrollToMessagesBottom();
    }
  },
);

onMounted(() => {
  // Wait 500 milliseconds before scroll ... Wait for render (idk -_-)
  const timeout = window.setTimeout(() => {
    scrollToMessagesBottom();

    window.clearTimeout(timeout);
  }, 500);
});
</script>
