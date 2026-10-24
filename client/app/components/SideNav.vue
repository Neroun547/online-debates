<template>
	<div
		class="border-gray-200 border-r-[1.5px] fixed top-[50px] h-full bg-white z-10 shadow-lg"
	>
		<div class="w-[150px] m-auto">
			<div class="block m-auto mt-5">
				<ULink
					to="/home"
					active-class="text-primary"
					inactive-class="text-black"
					class="flex items-center"
				>
					<UIcon
name="lucide:list"
class="block mr-2"
/>
					<div class="text-left w-full">{{ $t("sideNav.categories") }}</div>
				</ULink>
			</div>
			<div class="block m-auto mt-5">
				<ULink
					to="/users"
					active-class="text-primary"
					inactive-class="text-black"
					class="flex items-center"
				>
					<UIcon
name="lucide:circle-user-round"
class="block mr-2"
/>
					<div class="text-left w-full">{{ $t("sideNav.users") }}</div>
				</ULink>
			</div>
			<div class="block m-auto mt-5">
				<ULink
					to="/user/slots"
					active-class="text-primary"
					inactive-class="text-black"
					class="flex items-center"
				>
					<UIcon
name="lucide:calendar-plus-2"
class="block mr-2"
/>
					<div class="text-left w-full">{{ $t("sideNav.mySlots") }}</div>
				</ULink>
			</div>
			<div class="block m-auto mt-5">
				<ULink
					to="/user/subjects"
					active-class="text-primary"
					inactive-class="text-black"
					class="flex items-center"
				>
					<UIcon
name="lucide:notebook"
class="block mr-2"
/>
					<div class="text-left w-full">{{ $t("sideNav.mySubjects") }}</div>
				</ULink>
			</div>
			<div class="block m-auto mt-5">
				<ULink
					to="/my-sessions"
					active-class="text-primary"
					inactive-class="text-black"
					class="flex items-center"
				>
					<UIcon
name="lucide:clipboard-clock"
class="block mr-2"
/>
					<div>{{ $t("sideNav.mySessions") }}</div>
				</ULink>
			</div>
			<div class="block m-auto mt-5">
				<ULink
					to="/settings"
					active-class="text-primary"
					inactive-class="text-black"
					class="flex items-center"
				>
					<UIcon
name="lucide:settings"
class="block mr-2"
/>
					<div class="text-left w-full">{{ $t("sideNav.settings") }}</div>
				</ULink>
			</div>
			<div class="block m-auto mt-5">
				<ULink
					to="/support"
					active-class="text-primary"
					inactive-class="text-black"
					class="flex items-center"
				>
					<UIcon
name="lucide:circle-question-mark"
class="block mr-2"
/>
					<div>{{ $t("sideNav.support") }}</div>
				</ULink>
			</div>
			<div class="border-gray-200 border-t mt-5" />
			<div class="mt-5">
				<div class="flex items-center">
					<UIcon
name="lucide:log-in"
class="text-red-600 mr-2"
/>
					<button
class="cursor-pointer"
@click="userStore.logout"
>
						{{ $t("sideNav.exit") }}
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useUserStore } from "~/store/user/user.store"

const userStore = useUserStore()
</script>
