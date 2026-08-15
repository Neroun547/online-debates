export interface SessionsSocket {
  connected: boolean
  connect(): SessionsSocket
  disconnect(): SessionsSocket
  emit(event: string, payload?: unknown): SessionsSocket
  on<T>(event: string, listener: (payload: T) => void): SessionsSocket
  off<T>(event: string, listener: (payload: T) => void): SessionsSocket
}
