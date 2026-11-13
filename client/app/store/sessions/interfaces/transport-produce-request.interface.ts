import type { AppData, RtpParameters } from "mediasoup-client/types";

export interface TransportProduceRequestInterface {
	sessionId: number;
	kind: "audio" | "video";
	rtpParameters: RtpParameters;
	appData: AppData;
}
