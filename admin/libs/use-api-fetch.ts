import { useAuthStore } from "../store/auth/auth.store";

type ApiFetchOptions = Parameters<typeof $fetch>[1]

export async function useApiFetch<T>(
  url: string,
  options: ApiFetchOptions = {}
) {
  const config = useRuntimeConfig()
  const authStore = useAuthStore();
  const token = authStore.getToken;

  const headers = new Headers(options?.headers)

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }
  try {
    const api = await $fetch<T>(url, {
      //@ts-ignore
      baseURL: config.public.apiBaseUrl,
      ...options,
      headers
    });

    return api;
  } catch(err: any) {
    if(err.statusCode === 401) {
      authStore.setIsAuth(false);

      window.location.href = "/auth";

      return;
    }
    throw err;
  }
}
