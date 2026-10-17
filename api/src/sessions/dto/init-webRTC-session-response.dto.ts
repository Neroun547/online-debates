import {
    DtlsParameters,
    IceCandidate,
    IceParameters,
    RtpCapabilities,
} from "mediasoup/types";

export interface InitWebRTCSessionResponseInterface {
    transportId: string;
    iceParameters: IceParameters;
    iceCandidates: IceCandidate[];
    dtlsParameters: DtlsParameters;
    routerRtpCapabilities: RtpCapabilities;
}
