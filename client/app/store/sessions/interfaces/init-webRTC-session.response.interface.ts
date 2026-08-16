import * as mediasoup from "mediasoup-client";

export interface InitWebRTCSessionResponseInterface {
    transportId: string;
    iceParameters: mediasoup.types.IceParameters;
    iceCandidates: mediasoup.types.IceCandidate[];
    dtlsParameters: mediasoup.types.DtlsParameters;
    routerRtpCapabilities: mediasoup.types.RtpCapabilities;
}

