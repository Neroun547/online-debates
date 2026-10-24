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
				:aria-label="$t('sessionChat.ariaLabel')"
				class="fixed left-4 bottom-4 z-50 flex h-[min(620px,calc(100dvh-2rem))] w-[min(390px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
			>
				<header
					class="flex items-center justify-between border-b border-slate-200 px-5 py-4"
				>
					<div class="flex min-w-0 items-center gap-3">
						<div
							class="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-700"
						>
							<UIcon
name="lucide:messages-square"
class="size-5"
/>
						</div>

						<div class="min-w-0">
							<h2 class="truncate font-semibold text-slate-900">
								{{ $t("sessionChat.title") }}
							</h2>
						</div>
					</div>

					<UButton
						type="button"
						icon="lucide:x"
						color="neutral"
						variant="ghost"
						:aria-label="$t('sessionChat.closeChat')"
						class="cursor-pointer rounded-full"
						@click="isOpen = false"
					/>
				</header>

				<SessionChatContent
					:messages="props.messages"
					:is-load-more-available="props.isLoadMoreAvailable"
					@send-message="emit('sendMessage', $event)"
					@load-more="emit('loadMore')"
				/>
			</section>
		</Transition>

		<UButton
			v-if="!isOpen"
			type="button"
			:label="$t('sessionChat.openChat')"
			icon="lucide:message-circle"
			size="lg"
			class="cursor-pointer rounded-full shadow-lg"
			@click="isOpen = true"
		/>
	</div>
</template>

<script setup lang="ts">
import type { SessionChatMessage } from "./types/session-chat.types"
import SessionChatContent from "./SessionChatContent.vue"

interface Props {
	messages: SessionChatMessage[]
	isLoadMoreAvailable: boolean
}

const isOpen = defineModel<boolean>("isOpen", {
	default: false
})

const props = defineProps<Props>()

const emit = defineEmits<{
	sendMessage: [message: string]
	loadMore: []
}>()
</script>
