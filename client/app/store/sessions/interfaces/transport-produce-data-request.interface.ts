import type { SctpStreamParameters } from "mediasoup-client/types"

export interface TransportProduceDataRequestInterface {
	transportId: string
	sctpStreamParameters: SctpStreamParameters
	label: string | undefined
	protocol: string | undefined
	sessionId: number
}
