export interface BaseSocket {
  connected: boolean
  connect(): BaseSocket
  disconnect(): BaseSocket
  emit(event: string, payload?: unknown): BaseSocket
  on<T>(event: string, listener: (payload: T) => void): BaseSocket
  off<T>(event: string, listener: (payload: T) => void): BaseSocket
}
