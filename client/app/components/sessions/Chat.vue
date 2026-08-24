<script setup lang="ts">
const isOpen = defineModel<boolean>('isOpen', {
  default: false
})

const message = ref('')
</script>

<template>
  <div>
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="translate-y-3 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-3 opacity-0"
    >
      <section
        v-if="isOpen"
        aria-label="Session chat"
        class="fixed left-4 bottom-4 z-50 flex h-[min(620px,calc(100dvh-2rem))] w-[min(390px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
      >
        <header class="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div class="flex min-w-0 items-center gap-3">
            <div class="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-700">
              <UIcon
                name="lucide:messages-square"
                class="size-5"
              />
              <span
                class="absolute right-0 bottom-0 size-2.5 rounded-full border-2 border-white bg-green-500"
                aria-label="Online"
              />
            </div>

            <div class="min-w-0">
              <h2 class="truncate font-semibold text-slate-900">
                Session chat
              </h2>
              <p class="text-xs text-slate-500">
                2 participants online
              </p>
            </div>
          </div>

          <UButton
            type="button"
            icon="lucide:x"
            color="neutral"
            variant="ghost"
            aria-label="Close chat"
            class="cursor-pointer rounded-full"
            @click="isOpen = false"
          />
        </header>

        <div class="flex-1 space-y-5 overflow-y-auto bg-slate-50/60 px-4 py-5">
          <div class="flex items-center gap-3 text-xs text-slate-400">
            <span class="h-px flex-1 bg-slate-200" />
            <span>Today</span>
            <span class="h-px flex-1 bg-slate-200" />
          </div>

          <div class="flex items-end gap-2">
            <div class="flex size-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-semibold text-violet-700">
              AL
            </div>
            <div class="max-w-[78%]">
              <p class="mb-1 text-xs text-slate-500">
                Alex
              </p>
              <div class="rounded-2xl rounded-bl-sm bg-white px-3.5 py-2.5 text-sm leading-5 text-slate-700 shadow-sm ring-1 ring-slate-200/80">
                Hi! Are you ready to start the debate?
              </div>
              <p class="mt-1 text-[11px] text-slate-400">
                10:24
              </p>
            </div>
          </div>

          <div class="flex justify-end">
            <div class="max-w-[78%]">
              <div class="rounded-2xl rounded-br-sm bg-sky-500 px-3.5 py-2.5 text-sm leading-5 text-white shadow-sm">
                Yes, I am. Let's begin!
              </div>
              <p class="mt-1 text-right text-[11px] text-slate-400">
                10:25 · Read
              </p>
            </div>
          </div>

          <div class="flex items-end gap-2">
            <div class="flex size-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-semibold text-violet-700">
              AL
            </div>
            <div class="max-w-[78%]">
              <p class="mb-1 text-xs text-slate-500">
                Alex
              </p>
              <div class="rounded-2xl rounded-bl-sm bg-white px-3.5 py-2.5 text-sm leading-5 text-slate-700 shadow-sm ring-1 ring-slate-200/80">
                Great. I'll present my opening argument first.
              </div>
              <p class="mt-1 text-[11px] text-slate-400">
                10:25
              </p>
            </div>
          </div>
        </div>

        <form
          class="border-t border-slate-200 bg-white p-3"
          @submit.prevent
        >
          <div class="flex items-end gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2 focus-within:border-sky-400 focus-within:ring-2 focus-within:ring-sky-100">
            <textarea
              v-model="message"
              rows="1"
              aria-label="Message"
              placeholder="Write a message..."
              class="max-h-28 min-h-9 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400"
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
      </section>
    </Transition>

    <UButton
      v-if="!isOpen"
      type="button"
      label="Open chat"
      icon="lucide:message-circle"
      size="lg"
      class="fixed left-4 bottom-25 z-50 cursor-pointer rounded-full shadow-lg"
      @click="isOpen = true"
    />
  </div>
</template>
