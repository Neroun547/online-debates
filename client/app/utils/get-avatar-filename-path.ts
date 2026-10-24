export function getAvatarFilenamePath(filename: string | null): string {
	if (!filename) {
		return ""
	}
	const runtimeConfig = useRuntimeConfig()

	return runtimeConfig.public.userAvatarsBaseUrl + filename
}
