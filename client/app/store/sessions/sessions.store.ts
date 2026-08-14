import { useApiFetch } from '~/libs/useApiFetch'
import type { BaseStoreInterface } from '../base-store.interface'
import type {
  GetUserSessionsRequestInterface,
  GetUserSessionsResponseInterface
} from './interfaces/get-user-sessions.interface'

type ErrorValue = Parameters<typeof getErrorMessage>[0]

export const useSessionsStore = defineStore('sessions', {
  state: (): BaseStoreInterface => ({
    errorMessage: undefined,
    isError: false
  }),
  actions: {
    async getUserSessions(
      params: GetUserSessionsRequestInterface
    ): Promise<GetUserSessionsResponseInterface | undefined> {
      try {
        this.clearErrorState()

        return await useApiFetch<GetUserSessionsResponseInterface>('/user/sessions', {
          method: 'GET',
          query: params
        })
      } catch (error: unknown) {
        const apiError = error as {
          response?: { _data?: ErrorValue }
          data?: ErrorValue
        }

        this.setError(
          apiError.response?._data
          ?? apiError.data
          ?? (error instanceof Error ? error.message : undefined)
        )
      }
    },
    setError(value: ErrorValue) {
      this.isError = true
      this.errorMessage = getErrorMessage(value)
    },
    clearErrorState() {
      this.isError = false
      this.errorMessage = undefined
    }
  }
})
