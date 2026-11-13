import type { DtlsParameters } from "mediasoup-client/types";

export interface TransportConnectRequestInterface {
	transportId: string;
	dtlsParameters: DtlsParameters;
	sessionId: number;
	direction: "send" | "recv";
}
