<template>
	<div
		class="flex w-full justify-between p-5 border-b items-center border-gray-200"
	>
		<div>
			<LanguageSelect />
		</div>
		<div class="flex max-w-[500px] justify-between w-full max-md:hidden">
			<ULink to="/signup" class="text-black">
				{{ $t("landingNav.tryIt") }}
			</ULink>
			<ULink to="/support" class="text-black">
				{{ $t("landingNav.support") }}
			</ULink>
			<ULink to="/chat-rules" class="text-black">
				{{ $t("landingNav.chatRules") }}
			</ULink>
		</div>
		<div>
			<ULink to="/auth">
				<button
					class="bg-blue-500 cursor-pointer pl-10 pr-10 pt-2 pb-2 text-white rounded-xl max-md:text-sm"
				>
					{{ $t("landingNav.login") }}
				</button>
			</ULink>
		</div>
	</div>
</template>

<script setup lang="ts">
import LanguageSelect from "./LanguageSelect.vue";
</script>
