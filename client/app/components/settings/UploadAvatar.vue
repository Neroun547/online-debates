<template>
	<section class="overflow-hidden border border-default bg-default shadow">
		<div class="border-b border-default px-5 py-4 sm:px-6">
			<div class="flex items-start gap-3">
				<span
					class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
				>
					<UIcon name="i-lucide-image-up" class="size-5" />
				</span>

				<div>
					<h2 class="text-lg font-semibold text-highlighted">
						{{ $t("settings.avatar.title") }}
					</h2>
					<p class="mt-1 text-sm text-muted">
						{{ $t("settings.avatar.description") }}
					</p>
				</div>
			</div>
		</div>

		<form class="p-5 sm:p-6" @submit.prevent="updateAvatar">
			<div class="grid gap-5 md:grid-cols-[220px_minmax(0,1fr)]">
				<div
					class="flex flex-col items-center justify-center rounded-lg bg-elevated/50 px-5 py-6 text-center"
				>
					<UAvatar
						icon="i-lucide-user-round"
						size="3xl"
						color="primary"
						class="size-24 shadow ring-4 ring-primary/10"
						:src="getAvatarFilenamePath(userStore.avatarFilename)"
					/>
					<p class="mt-4 text-sm font-medium text-highlighted">
						{{ $t("settings.avatar.currentAvatar") }}
					</p>
					<p class="mt-1 text-xs text-muted">
						{{ $t("settings.avatar.currentAvatarDescription") }}
					</p>
				</div>

				<div>
					<UFileUpload
						v-model="avatar"
						name="avatar"
						accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
						icon="i-lucide-cloud-upload"
						color="primary"
						size="lg"
						layout="grid"
						position="inside"
						file-delete
						:label="$t('settings.avatar.selectImage')"
						:description="$t('settings.avatar.requirements')"
						class="min-h-52 w-full"
						:ui="{
							base: 'min-h-52 border-dashed',
							label: 'text-sm sm:text-base',
							description: 'max-w-sm text-xs sm:text-sm',
							file: 'inset-auto left-1/2 top-1/2 size-40 -translate-x-1/2 -translate-y-1/2 overflow-visible rounded-full ring-4 ring-primary/10 sm:size-44',
							fileLeadingAvatar: 'size-full rounded-full [&_img]:rounded-full'
						}"
					/>
					<p
						v-if="avatarValidationError"
						role="alert"
						class="mt-2 text-sm text-error"
					>
						{{ avatarValidationError }}
					</p>
				</div>
			</div>

			<div
				class="mt-6 flex flex-col-reverse gap-3 border-t border-default pt-5 sm:flex-row sm:justify-end"
			>
				<UButton
					type="button"
					color="neutral"
					variant="outline"
					icon="i-lucide-trash-2"
					:label="$t('settings.avatar.removeAvatar')"
					class="justify-center"
					:loading="isDeleteAvatarLoading"
					@click="deleteAvatar"
				/>
				<UButton
					type="submit"
					icon="i-lucide-upload"
					:label="$t('settings.avatar.saveAvatar')"
					class="justify-center"
					:loading="isUpdateAvatarLoading"
				/>
			</div>
		</form>
	</section>
</template>

<script setup lang="ts">
import { useUserStore } from "~/store/user/user.store";

const toast = useToast();
const userStore = useUserStore();

const isUpdateAvatarLoading = ref<boolean>(false);
const isDeleteAvatarLoading = ref<boolean>(false);

const MAX_AVATAR_SIZE = 30 * 1024 * 1024;
const ALLOWED_AVATAR_MIME_TYPES = new Set([
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/webp"
]);
const ALLOWED_AVATAR_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

const avatar = ref<File | null>(null);
const avatarValidationError = ref<string | null>(null);

watch(avatar, (file) => {
	if (!file) {
		return;
	}

	const filename = file.name.toLowerCase();
	const hasAllowedType = ALLOWED_AVATAR_MIME_TYPES.has(file.type);
	const hasAllowedExtension = ALLOWED_AVATAR_EXTENSIONS.some((extension) =>
		filename.endsWith(extension)
	);

	if (!hasAllowedType || !hasAllowedExtension) {
		avatarValidationError.value = $t("settings.avatar.invalidFormat");
		avatar.value = null;

		return;
	}

	if (file.size > MAX_AVATAR_SIZE) {
		avatarValidationError.value = $t("settings.avatar.fileTooLarge");
		avatar.value = null;

		return;
	}

	avatarValidationError.value = null;
});

async function deleteAvatar() {
	isDeleteAvatarLoading.value = true;
	await userStore.deleteAvatar();

	if (userStore.isError) {
		toast.add({
			title: "Error",
			description: userStore.errorMessage,
			color: "error"
		});
	} else {
		toast.add({
			title: $t("settings.avatar.deleted"),
			description: $t("settings.avatar.deletedSuccessfully"),
			color: "success"
		});
	}
	isDeleteAvatarLoading.value = false;
}

async function updateAvatar() {
	isUpdateAvatarLoading.value = true;
	if (avatar.value) {
		await userStore.updateAvatar(avatar.value);

		if (userStore.isError) {
			toast.add({
				title: "Error",
				description: userStore.errorMessage,
				color: "error"
			});
		} else {
			toast.add({
				title: $t("settings.avatar.updated"),
				description: $t("settings.avatar.updatedSuccessfully"),
				color: "success"
			});
		}
	}
	isUpdateAvatarLoading.value = false;
}
</script>
