<template>
  <div v-if="isError" class="mt-15">
    {{ errorMessage }}
  </div>
  <div>
    <video ref="localVideoElement" autoplay muted playsinline></video>
    <video ref="remoteVideoElement" autoplay playsinline></video>
  </div>
</template>
<script setup lang="ts">
export interface NewProducerPayload {
  sessionId: number;
  producerId: string;
  producerUserId: number;
  kind: "audio" | "video";
}

import * as mediasoupClient from "mediasoup-client";
import { useAppStore } from "~/store/app-store";
import type { InitWebRTCSessionResponseInterface } from "~/store/sessions/interfaces/init-webRTC-session.response.interface";
import { useSessionsStore } from "~/store/sessions/sessions.store";
import type { SessionsSocket } from "~/types/sessions-socket.interface";

const { $sessionsSocket: injectedSessionsSocket } = useNuxtApp();
const $sessionsSocket = injectedSessionsSocket as SessionsSocket;

const sessionsStore = useSessionsStore();
const appStore = useAppStore();

const isError = ref<boolean>(false);
const errorMessage = ref<string>("");
const localVideoElement = ref<HTMLVideoElement | null>(null);
const remoteVideoElement = ref<HTMLVideoElement | null>(null);

const route = useRoute();
const consumers = new Map<string, mediasoupClient.types.Consumer>();

let devicePromise: Promise<mediasoupClient.Device> | undefined;
let recvTransportPromise: Promise<mediasoupClient.types.Transport> | undefined;
let recvTransport: mediasoupClient.types.Transport | undefined;
let sendTransport: mediasoupClient.types.Transport | undefined;
let localStream: MediaStream | undefined;
let remoteStream: MediaStream | undefined;

let isStreamCleared: boolean = false;

let loadedStreamTypes: Array<"audio" | "video"> = [];

async function getDevice(
  routerRtpCapabilities: mediasoupClient.types.RtpCapabilities,
): Promise<mediasoupClient.Device> {
  if (!devicePromise) {
    devicePromise = (async () => {
      const handlerName = await mediasoupClient.detectDeviceAsync();

      if (!handlerName) {
        throw new Error("No handler name");
      }

      const device = new mediasoupClient.Device({ handlerName });

      await device.load({ routerRtpCapabilities });

      return device;
    })();
  }

  return devicePromise;
}

async function createConsumer(payload: NewProducerPayload) {
  const transport = await getRecvTransport(payload.sessionId);
  const device = await devicePromise;

  if (!device) {
    throw new Error("Device is not initialized");
  }

  const response = await sessionsStore.consume({
    sessionId: payload.sessionId,
    producerId: payload.producerId,
    rtpCapabilities: device.rtpCapabilities,
  });

  if (!response || sessionsStore.isError) {
    throw new Error(sessionsStore.errorMessage ?? "Failed to create consumer");
  }

  const consumer = await transport.consume({
    id: response.id,
    producerId: response.producerId,
    kind: response.kind,
    rtpParameters: response.rtpParameters,
  });

  consumers.set(consumer.id, consumer);

  if (!remoteStream) {
    remoteStream = new MediaStream();
  }
  remoteStream.addTrack(consumer.track);

  if (remoteVideoElement.value) {
    remoteVideoElement.value.srcObject = remoteStream;
  }

  const removeConsumer = () => {
    consumers.delete(consumer.id);
    remoteStream?.removeTrack(consumer.track);
  };

  consumer.on("transportclose", removeConsumer);
  consumer.on("trackended", removeConsumer);

  await sessionsStore.resumeConsumer({
    sessionId: payload.sessionId,
    consumerId: consumer.id,
  });

  if (sessionsStore.isError) {
    consumer.close();
    removeConsumer();
    throw new Error(sessionsStore.errorMessage ?? "Failed to resume consumer");
  }
}

async function getRecvTransport(
  sessionId: number,
): Promise<mediasoupClient.types.Transport> {
  if (recvTransportPromise) {
    return recvTransportPromise;
  }

  const transportPromise = (async () => {
    const response = await sessionsStore.initSession(Number(sessionId), "recv");

    if (!response || sessionsStore.isError) {
      throw new Error(sessionsStore.errorMessage);
    }
    const device = await getDevice(response.routerRtpCapabilities);

    const transport = device.createRecvTransport({
      id: response.transportId,
      iceParameters: response.iceParameters,
      iceCandidates: response.iceCandidates,
      dtlsParameters: response.dtlsParameters,
    });

    transport.on("connect", async ({ dtlsParameters }, callback, errback) => {
      try {
        await sessionsStore.transportConnect({
          sessionId: Number(sessionId),
          transportId: transport.id,
          dtlsParameters,
          direction: "recv",
        });

        if (sessionsStore.isError) {
          throw new Error(sessionsStore.errorMessage);
        }

        callback();
      } catch (error: any) {
        errback(error);
      }
    });

    recvTransport = transport;

    return transport;
  })();

  recvTransportPromise = transportPromise;

  try {
    return await transportPromise;
  } catch (error) {
    if (recvTransportPromise === transportPromise) {
      recvTransportPromise = undefined;
    }
    throw error;
  }
}

async function createSendTransport() {
  try {
    const response: InitWebRTCSessionResponseInterface | undefined = await sessionsStore.initSession(
      Number(route.params.id),
      "send",
    );

    if (!response || sessionsStore.isError) {
      throw new Error(sessionsStore.errorMessage);
    }
    const device = await getDevice(response.routerRtpCapabilities);

    if (device.loaded) {
      // Send webcam video with 3 simulcast streams.
      const transport = device.createSendTransport({
        id: response.transportId,
        iceParameters: response.iceParameters,
        iceCandidates: response.iceCandidates,
        dtlsParameters: response.dtlsParameters,
      });
      sendTransport = transport;

      transport.on("connect", async ({ dtlsParameters }, callback, errback) => {
        // Signal local DTLS parameters to the server side transport.
        try {
          await sessionsStore.transportConnect({
            transportId: transport.id,
            dtlsParameters: dtlsParameters,
            sessionId: Number(route.params.id),
            direction: "send",
          });

          if (sessionsStore.isError) {
            throw new Error(sessionsStore.errorMessage);
          }
          // Tell the transport that parameters were transmitted.
          callback();
        } catch (error: any) {
          // Tell the transport that something was wrong.
          errback(error);
        }
      });

      transport.on("produce", async (parameters, callback, errback) => {
        try {
          const response = await sessionsStore.transportProduce({
            sessionId: Number(route.params.id),
            kind: parameters.kind,
            rtpParameters: parameters.rtpParameters,
            appData: parameters.appData,
          });

          if (!response) {
            throw new Error("Transport not found");
          }
          callback({ id: response.id });
        } catch (error: any) {
          errback(error);
        }
      });

      transport.on("producedata", async (parameters, callback, errback) => {
        // Signal parameters to the server side transport and retrieve the id of
        // the server side new producer.
        try {
          const response = await sessionsStore.transportProduceData({
            transportId: transport.id,
            sctpStreamParameters: parameters.sctpStreamParameters,
            label: parameters.label,
            protocol: parameters.protocol,
            sessionId: Number(route.params.id),
          });

          if (!response || sessionsStore.isError) {
            throw new Error(sessionsStore.errorMessage);
          }
          callback({ id: response.id });
        } catch (error: any) {
          // Tell the transport that something was wrong.
          errback(error);
        }
      });

      // Send webcam video with 3 simulcast streams.
      localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      if (localVideoElement.value) {
        localVideoElement.value.srcObject = localStream;
      }

      const videoTrack = localStream.getVideoTracks()[0];
      const audioTrack = localStream.getAudioTracks()[0];

      await transport.produce({
        track: videoTrack,
        encodings: [
          { maxBitrate: 100000 },
          { maxBitrate: 300000 },
          { maxBitrate: 900000 },
        ],
        codecOptions: {
          videoGoogleStartBitrate: 1000,
        },
      });
      await transport.produce({
        track: audioTrack,
      });
    }
  } catch (error: any) {
    if (error.name === "UnsupportedError")
      errorMessage.value = "Browser not supported";
  }
}

function clearStream(type: "audio" | "video") {
    console.log(loadedStreamTypes, Date.now());
    if(loadedStreamTypes.length < 1) {
        remoteStream = undefined;
    }
    loadedStreamTypes.push(type);
    
    if(loadedStreamTypes.length === 2) {
        loadedStreamTypes = [];
    }
}

async function handleNewProducer(payload: NewProducerPayload) {
  try {
    clearStream(payload.kind);
    await createConsumer(payload);
    console.log(payload.kind, loadedStreamTypes, Date.now());
  } catch (error: unknown) {
    isError.value = true;
    errorMessage.value =
      error instanceof Error ? error.message : "Failed to consume producer";
  }
}

onMounted(async () => {
  appStore.setIsLoading(false);
  appStore.setIsGoBackButtonVisible(true);
  appStore.setIsSideNavHidden(true);
  appStore.setGoBackAction(function () {
    window.location.href = "/my-sessions";
  });
  $sessionsSocket.emit("session:join", {
    sessionId: Number(route.params.id),
  });
  $sessionsSocket.on("session:new-producer", handleNewProducer);

  await createSendTransport();
  const producerData = await sessionsStore.getProducerData(
    Number(route.params.id),
  );

  if (!producerData) {
    return;
  }
  const audioPayload: NewProducerPayload = {
    sessionId: producerData.sessionId,
    producerId: producerData.producerAudioId,
    producerUserId: producerData.producerUserId,
    kind: "audio",
  };
  const videoPayload: NewProducerPayload = {
    sessionId: producerData.sessionId,
    producerId: producerData.producerVideoId,
    producerUserId: producerData.producerUserId,
    kind: "video",
  };

  handleNewProducer(audioPayload);
  handleNewProducer(videoPayload);
});

onBeforeUnmount(() => {
  $sessionsSocket.off("session:new-producer", handleNewProducer);
  $sessionsSocket.emit("session:leave", {
    sessionId: Number(route.params.id),
  });

  consumers.forEach((consumer) => consumer.close());
  consumers.clear();
  sendTransport?.close();
  recvTransport?.close();
  localStream?.getTracks().forEach((track) => track.stop());
});
</script>
