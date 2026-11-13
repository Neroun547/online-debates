<template>
	<section
		:aria-label="$t('mobileChat.ariaLabel')"
		class="flex h-[min(620px,calc(100dvh-2rem))] w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
	>
		<header class="flex items-center gap-3 border-b border-slate-200 px-5 py-4">
			<div
				class="flex size-10 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-700"
			>
				<UIcon name="lucide:messages-square" class="size-5" />
			</div>

			<h2 class="truncate font-semibold text-slate-900">
				{{ $t("mobileChat.title") }}
			</h2>
		</header>

		<SessionChatContent
			:messages="props.messages"
			:is-load-more-available="props.isLoadMoreAvailable"
			@send-message="emit('sendMessage', $event)"
			@load-more="emit('loadMore')"
		/>
	</section>
</template>

<script setup lang="ts">
import type { SessionChatMessage } from "./types/session-chat.types";
import SessionChatContent from "./SessionChatContent.vue";

interface Props {
	messages: SessionChatMessage[];
	isLoadMoreAvailable: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
	sendMessage: [message: string];
	loadMore: [];
}>();
</script>
