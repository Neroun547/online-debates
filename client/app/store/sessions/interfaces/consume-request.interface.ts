import type { RtpCapabilities } from "mediasoup-client/types"

export interface ConsumeRequestInterface {
	sessionId: number
	producerId: string
	rtpCapabilities: RtpCapabilities
}
