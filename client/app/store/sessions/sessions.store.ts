import { useApiFetch } from '~/libs/useApiFetch'
import type { BaseStoreInterface } from '../base-store.interface'
import type {
  GetUserSessionsRequestInterface,
  GetUserSessionsResponseInterface
} from './interfaces/get-user-sessions.interface'
import type {
  MediaKind,
  RtpCapabilities,
  RtpParameters
} from 'mediasoup-client/types'
import type { NewProducerPayload } from '~/pages/my-sessions/[id]/index.vue'

type ErrorValue = Parameters<typeof getErrorMessage>[0]

function getApiErrorValue(error: unknown): ErrorValue {
  const apiError = error as {
    response?: { _data?: ErrorValue }
    data?: ErrorValue
  }

  return apiError.response?._data
    ?? apiError.data
    ?? (error instanceof Error ? error.message : undefined)
}

interface ConsumeResponseInterface {
  id: string
  producerId: string
  kind: MediaKind
  rtpParameters: RtpParameters
}

export const useSessionsStore = defineStore('sessions', {
  state: (): BaseStoreInterface => ({
    errorMessage: undefined,
    isError: false
  }),
  actions: {
    async consume(params: {
      sessionId: number
      producerId: string
      rtpCapabilities: RtpCapabilities
    }): Promise<ConsumeResponseInterface | undefined> {
      try {
        this.clearErrorState()

        return await useApiFetch<ConsumeResponseInterface>(
          `/user/sessions/${params.sessionId}/webRTC/consume`,
          {
            method: 'POST',
            body: {
              producerId: params.producerId,
              rtpCapabilities: params.rtpCapabilities
            }
          }
        )
      } catch (error: unknown) {
        this.setError(getApiErrorValue(error))
      }
    },
    async resumeConsumer(params: {
      sessionId: number
      consumerId: string
    }): Promise<void> {
      try {
        this.clearErrorState()

        await useApiFetch(
          `/user/sessions/${params.sessionId}/webRTC/consumer-resume`,
          {
            method: 'POST',
            body: {
              consumerId: params.consumerId
            }
          }
        )
      } catch (error: unknown) {
        this.setError(getApiErrorValue(error))
      }
    },
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
        this.setError(getApiErrorValue(error))
      }
    },
    async transportProduceData(params: {
        transportId: string;
        sctpStreamParameters: any;
        label: any;
        protocol: any;
        sessionId: number;
    }): Promise<{ id: string } | undefined> {
        try {
            this.clearErrorState();

            return await useApiFetch<{ id: string }>("/user/sessions/" + params.sessionId + "/webRTC/transport-produce-data", {
                method: "POST",
                body: {
                    transportId: params.transportId,
                    sctpStreamParameters: params.sctpStreamParameters,
                    label: params.label,
                    protocol: params.protocol,
                    sessionId: params.sessionId
                }
            });
        } catch(error: any) {
            this.setError(error);
        }
    },
    async transportProduce(params: {
        sessionId: number;
        kind: string;
        rtpParameters: any;
        appData: any;
    }): Promise<{ id: string } | undefined> {
        try {
            this.clearErrorState();

            return await useApiFetch<{ id: string }>('/user/sessions/' + params.sessionId + "/webRTC/transport-produce", {
                method: "POST",
                body: {
                    kind: params.kind,
                    rtpParameters: params.rtpParameters,
                    appData: params.appData
                }
            });
        } catch(error: any) {
            this.setError(error);
        }
    },  
    async transportConnect(params: {
        transportId: any;
        dtlsParameters: any;
        sessionId: number;
        direction: "send" | "recv"
    }) {
        try {   
            this.clearErrorState();

            await useApiFetch('/user/sessions/' + params.sessionId + "/webRTC/transport-connect", { 
                method: "POST", 
                body: {
                    dtlsParameters: params.dtlsParameters,
                    transportId: params.transportId,
                    direction: params.direction
                } 
            });
        } catch(error: any) {
            this.setError(error);
        }
    },
    async initSession(sessionId: number, direction: "send" | "recv"): Promise<any> {
        try {
            this.clearErrorState();

            return await useApiFetch(
                "/user/sessions/" + sessionId + "/webRTC/init", { 
                    method: "POST",
                    body: {
                        direction: direction
                    }        
                }
            );
        } catch(error: any) {
            this.setError(error);
        }
    },
    async getProducerData(sessionId: number): Promise<{
        sessionId: number;
        producerAudioId: string;
        producerVideoId: string;
        producerUserId: number;
        kind: "audio" | "video";
    } | undefined> {
        try {
            this.clearErrorState();

            return await useApiFetch<{
                sessionId: number;
                producerAudioId: string;
                producerVideoId: string;
                producerUserId: number;
                kind: "audio" | "video";
            }>("/user/sessions/" + sessionId + "/webRTC/producer-data", {
                method: "GET"
            });
        } catch(error: any) {
            this.setError(error);
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
