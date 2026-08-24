import { useApiFetch } from '~/libs/useApiFetch'
import type { BaseStoreInterface } from '../base-store.interface'
import type {
  GetUserSessionsRequestInterface,
  GetUserSessionsResponseInterface
} from './interfaces/get-user-sessions.interface'
import type {
  MediaKind,
  RtpParameters
} from 'mediasoup-client/types'
import type { InitWebRTCSessionResponseInterface } from './interfaces/init-webRTC-session.response.interface'
import type { GetProducerDataResponseInterface } from './interfaces/get-producer-data-response.interface'
import type { TransportProduceDataResponseInterface } from './interfaces/transport-produce-data-response.interface'
import type { ConsumeRequestInterface } from './interfaces/consume-request.interface'
import type { ResumeConsumeRequestInterface } from './interfaces/resume-consumer-request.interface'
import type { TransportProduceDataRequestInterface } from './interfaces/transport-produce-data-request.interface'
import type { TransportProduceRequestInterface } from './interfaces/transport-produce-request.interface'
import type { TransportConnectRequestInterface } from './interfaces/transport-connect-request.interface'
import type { GetChatMessagesResponseInterface } from './interfaces/get-chat-messages-response.interface'

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
    async consume(params: ConsumeRequestInterface): Promise<ConsumeResponseInterface | undefined> {
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
      } catch (error: any) {
        this.setError(getErrorMessage(error))
      }
    },
    async resumeConsumer(params: ResumeConsumeRequestInterface): Promise<void> {
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
      } catch (error: any) {
        this.setError(getErrorMessage(error))
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
      } catch (error: any) {
        this.setError(getErrorMessage(error))
      }
    },
    async transportProduceData(params: TransportProduceDataRequestInterface): Promise<TransportProduceDataResponseInterface | undefined> {
        try {
            this.clearErrorState();

            return await useApiFetch<TransportProduceDataResponseInterface>("/user/sessions/" + params.sessionId + "/webRTC/transport-produce-data", {
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
    async transportProduce(params: TransportProduceRequestInterface): Promise<{ id: string } | undefined> {
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
    async transportConnect(params: TransportConnectRequestInterface): Promise<void> {
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
    async initSession(sessionId: number, direction: "send" | "recv"): Promise<InitWebRTCSessionResponseInterface | undefined> {
        try {
            this.clearErrorState();

            return await useApiFetch<InitWebRTCSessionResponseInterface>(
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
    async getProducerData(sessionId: number): Promise<GetProducerDataResponseInterface | undefined> {
        try {
            this.clearErrorState();

            return await useApiFetch<GetProducerDataResponseInterface>("/user/sessions/" + sessionId + "/webRTC/producer-data", {
                method: "GET"
            });
        } catch(error: any) {
            this.setError(error);
        }
    },
    async getChatMessages(params: {
      sessionId: number;
      limit: number;
      skip: number;
    }): Promise<GetChatMessagesResponseInterface | undefined> {
      try {
        this.clearErrorState();

        return await useApiFetch<GetChatMessagesResponseInterface>("/user/sessions/" + params.sessionId + "/chat/messages?skip=" + params.skip + "&limit=" + params.limit, { 
          method: "GET"
        });
      } catch(error: any) {
        this.setError(error);
      }
    },
    setError(value: any) {
      this.isError = true
      this.errorMessage = getErrorMessage(value)
    },
    clearErrorState() {
      this.isError = false
      this.errorMessage = undefined
    }
  }
})
