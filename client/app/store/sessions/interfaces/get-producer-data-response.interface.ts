export interface GetProducerDataResponseInterface {
    sessionId: number;
    producerAudioId: string;
    producerVideoId: string;
    producerUserId: number;
    kind: "audio" | "video";
}
