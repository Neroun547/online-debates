type ApiFetchOptions = Parameters<typeof $fetch>[1]

export function useApiFetch<T>(
  url: string,
  options: ApiFetchOptions = {}
) {
  const config = useRuntimeConfig()
  const token = localStorage.getItem('token')

  const headers = new Headers(options?.headers)

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  return $fetch<T>(url, {
    //@ts-ignore
    baseURL: config.public.apiBaseUrl,
    ...options,
    headers
  })
}

