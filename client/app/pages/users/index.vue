<template>
	<div class="mt-15">
		<h2 class="text-center text-4xl max-md:text-2xl">
			{{ $t("users.title") }}
		</h2>
		<div class="flex justify-center w-full">
			<UForm
				:schema="formSchema"
				:state="formState"
				class="flex mt-10 flex-wrap gap-x-5 gap-y-3 w-full"
				@submit.prevent="findByFilters(true)"
			>
				<UFormField
					:label="$t('users.usernameOrEmail')"
					name="usernameOrEmail"
					class="max-w-[400px] w-full"
				>
					<UInput
						v-model="formState.usernameOrEmail"
						name="usernameOrEmail"
						class="max-w-[400px] w-full"
						:placeholder="$t('users.usernameOrEmail')"
					/>
				</UFormField>
				<UFormField
name="ageFrom"
:label="$t('users.ageFrom')"
>
					<UInputNumber
						v-model="formState.ageFrom"
						name="ageFrom"
						:placeholder="$t('users.ageFrom')"
					/>
				</UFormField>
				<UFormField
name="ageTo"
:label="$t('users.ageTo')"
>
					<UInputNumber
						v-model="formState.ageTo"
						name="ageTo"
						:placeholder="$t('users.ageTo')"
					/>
				</UFormField>
				<UFormField
					name="sex"
					:label="$t('users.sex')"
					class="max-w-[100px] w-full"
				>
					<USelect
						v-model="formState.sex"
						:items="sexSelectItems"
						class="max-w-[100px] w-full"
						name="sex"
					/>
				</UFormField>
				<UButton
					type="submit"
					:label="$t('users.search')"
					class="cursor-pointer h-[40px] mt-auto flex items-center"
					icon="lucide:search"
					:loading="isFindUsersLoading"
				/>
			</UForm>
		</div>
		<h2
			v-if="!users.length && !isFindUsersLoading"
			class="text-2xl font-bold text-center mt-20"
		>
			{{ $t("users.usersNotFound") }}
		</h2>
		<div>
			<Loader
v-if="isFindUsersLoading"
class="mt-20 m-auto w-max"
/>
			<div
v-for="user in users"
class="shadow p-5 mt-5"
>
				<div class="flex items-center max-md:flex-col max-md:items-start">
					<div class="max-md:flex max-md:items-center">
						<UAvatar
							:src="getAvatarFilenamePath(user.avatarFilename)"
							icon="i-lucide-user-round"
							class="size-16"
							:ui="{ icon: 'w-[30px] h-[30px]' }"
						/>
						<div class="ml-5 max-md:block hidden max-md:ml-2">
							<h2 class="text-2xl">
								{{ user.username }}
							</h2>
							<p class="text-[13px] line-clamp-4 max-w-[220px]">
								{{ user.email }}
							</p>
						</div>
					</div>
					<div class="ml-5 max-md:hidden">
						<h2 class="text-2xl">
							{{ user.username }}
						</h2>
						<p class="text-[13px] line-clamp-4 max-w-[300px]">
							{{ user.email }}
						</p>
					</div>
					<div
						v-if="user.description"
						class="max-w-[300px] m-auto text-sm italic max-md:mt-5"
					>
						<p class="line-clamp-4">
							{{ user.description }}
						</p>
					</div>
				</div>
				<div class="w-max ml-auto max-md:mt-5">
					<RouterLink
						:to="usersStore.userId !== user.id ? '/users/' + user.id : ''"
						:class="
							usersStore.userId !== user.id
								? 'text-primary underline max-md:text-sm'
								: 'text-neutral-500 cursor-auto'
						"
						>{{
							usersStore.userId !== user.id
								? $t("users.viewProfile")
								: $t("users.itsYou")
						}}</RouterLink>
				</div>
			</div>
			<UButton
				v-if="isLoadMoreButtonAvailable"
				:label="$t('users.loadMore')"
				class="cursor-pointer m-auto mt-5 block"
				:loading="isFindUsersLoading"
				@click="loadMoreUsers"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useAppStore } from "~/store/app-store"
import zod, { z } from "zod"
import { useUserStore } from "~/store/user/user.store"
import type { UserInterface } from "~/store/user/interfaces/user-response.interface"
import Loader from "~/components/Loader.vue"

const { t } = useI18n()

const appStore = useAppStore()
const usersStore = useUserStore()

const isFindUsersLoading = ref<boolean>(true)

const sexSelectItems = [
	{ value: "all", label: t("users.sexSelect.all") },
	{ value: "male", label: t("users.sexSelect.male") },
	{ value: "female", label: t("users.sexSelect.female") }
]

const formSchema = zod.object({
	usernameOrEmail: z.string().max(256).optional(),
	ageFrom: z.number().int().optional(),
	ageTo: z.number().max(130).int().optional(),
	sex: z.string()
})

const users = ref<UserInterface[]>([])

const isLoadMoreButtonAvailable = ref<boolean>(false)

const formState = reactive<{
	usernameOrEmail: string
	ageFrom: number
	ageTo: number
	sex: "all" | "male" | "female"
}>({
	usernameOrEmail: "",
	ageFrom: 14,
	ageTo: 70,
	sex: "all"
})

const page = ref(1)
const limit = 20

function findByFilters(activateLoader?: boolean) {
	page.value = 1
	users.value = []

	findUsers(activateLoader)
}

function loadMoreUsers() {
	page.value += 1

	findUsers(true)
}

async function findUsers(activateLoader?: boolean) {
	if (activateLoader) {
		isFindUsersLoading.value = true
	}
	const response = await usersStore.findUsers({
		emailOrUsername: formState.usernameOrEmail.trim().length
			? formState.usernameOrEmail.trim()
			: undefined,
		ageFrom: formState.ageFrom,
		ageTo: formState.ageTo,
		sex: formState.sex,
		page: page.value,
		limit: limit
	})

	if (response) {
		users.value.push(...response.data)
		isLoadMoreButtonAvailable.value = response.isLoadMoreAvailable
	}
	isFindUsersLoading.value = false
}

onMounted(() => {
	page.value = 1

	findUsers().finally(() => {
		appStore.setIsLoading(false)
	})
})
</script>
