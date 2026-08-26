<template>
  <div class="w-full mt-[50px]">
    <div v-if="isError" class="mt-15">
      {{ errorMessage }}
    </div>
    <div class="flex justify-between w-full m-auto max-md:flex-col">
      <video
        ref="localVideoElement"
        autoplay
        muted
        playsinline
        class="w-1/2 max-md:w-full"
      ></video>
      <div
        class="relative w-1/2 max-md:w-full bg-black flex justify-center items-center"
      >
        <video
          ref="remoteVideoElement"
          autoplay
          playsinline
          class="w-1/2 max-md:w-full"
        ></video>
        <div
          v-if="!isRemoteVideoAvailable"
          class="bg-gray-400 w-full h-full absolute top-0 flex items-center justify-center max-md:w-full max-md:h-full"
        >
          <div>
            <h2 class="text-2xl text-white text-center">No video</h2>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-10 ml-5 md:visible max-md:hidden">
      <Chat
        :is-open="isChatOpen"
        @sendMessage="(message: string) => sendChatMessage(message)"
        :messages="chatMessages"
        :is-load-more-available="isLoadMoreMessagesAvailable"
        @loadMore="loadMoreChatMessages"
      />
    </div>
    <div class="max-md:block hidden">
      <MobileChat
        :messages="chatMessages"
        :is-load-more-available="isLoadMoreMessagesAvailable"
        @send-message="(message: string) => sendChatMessage(message)"
        @loadMore="loadMoreChatMessages"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
export interface NewChatMessagePayload {
  message: string;
  createdAt: string;
}

export interface NewProducerPayload {
  sessionId: number;
  producerId: string;
  producerUserId: number;
  kind: "audio" | "video";
}

import { DateTime } from "luxon";
import * as mediasoupClient from "mediasoup-client";
import Chat from "~/components/sessions/Chat.vue";
import MobileChat from "~/components/sessions/MobileChat.vue";
import { useAppStore } from "~/store/app-store";
import type { InitWebRTCSessionResponseInterface } from "~/store/sessions/interfaces/init-webRTC-session.response.interface";
import { useSessionsStore } from "~/store/sessions/sessions.store";
import type { BaseSocket } from "~/types/base-socket.interface";

const { $sessionsSocket: injectedSessionsSocket } = useNuxtApp();
const $sessionsSocket = injectedSessionsSocket as BaseSocket;

const sessionsStore = useSessionsStore();
const appStore = useAppStore();

const isError = ref<boolean>(false);
const errorMessage = ref<string>("");
const localVideoElement = ref<HTMLVideoElement | null>(null);
const remoteVideoElement = ref<HTMLVideoElement | null>(null);

const isRemoteVideoAvailable = ref<boolean>(false);

const isLoadMoreMessagesAvailable = ref<boolean>(false);
const chatMessagesSkip = ref(0);
const chatMessagesLimit = ref(20);
const isChatOpen = ref(false);
const chatMessages = ref<
  Array<{
    content: string;
    createdAt: string;
    isSender: boolean;
  }>
>([]);

const route = useRoute();
const consumers = new Map<string, mediasoupClient.types.Consumer>();

let devicePromise: Promise<mediasoupClient.Device> | undefined;
let recvTransportPromise: Promise<mediasoupClient.types.Transport> | undefined;
let recvTransport: mediasoupClient.types.Transport | undefined;
let sendTransport: mediasoupClient.types.Transport | undefined;
let localStream: MediaStream | undefined;
let remoteStream: MediaStream | undefined;

let loadedStreamTypes: Array<"audio" | "video"> = [];

function sendChatMessage(message: string) {
  const now = new Date();

  $sessionsSocket.emit("session:chat:message", {
    message: message.trim(),
    sessionId: Number(route.params.id),
    date: DateTime.fromJSDate(now).toFormat("yyyy-MM-dd HH:mm"),
  });

  chatMessages.value = [
    ...chatMessages.value,
    {
      content: message.trim(),
      createdAt: DateTime.fromJSDate(now).toFormat("yyyy-MM-dd HH:mm"),
      isSender: true,
    },
  ];
}

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
    rtpCapabilities: device.recvRtpCapabilities,
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
    consumerId: response.id,
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
    const response: InitWebRTCSessionResponseInterface | undefined =
      await sessionsStore.initSession(Number(route.params.id), "send");

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
  if (loadedStreamTypes.length < 1) {
    remoteStream = undefined;
  }
  loadedStreamTypes.push(type);

  if (loadedStreamTypes.length === 2) {
    loadedStreamTypes = [];
  }
}

async function getChatMessages() {
  const response = await sessionsStore.getChatMessages({
    sessionId: Number(route.params.id),
    limit: chatMessagesLimit.value,
    skip: chatMessagesSkip.value,
  });

  if (response) {
    chatMessages.value.unshift(...response.messages);
    isLoadMoreMessagesAvailable.value = response.isLoadMoreAvailable;
  }
}

async function loadMoreChatMessages() {
  chatMessagesSkip.value += chatMessagesLimit.value;

  await getChatMessages();
}

async function handleNewProducer(payload: NewProducerPayload) {
  try {
    isRemoteVideoAvailable.value = true;
    clearStream(payload.kind);
    await createConsumer(payload);
  } catch (error: unknown) {}
}

function handleNewChatMessage(payload: NewChatMessagePayload) {
  chatMessages.value = [
    ...chatMessages.value,
    {
      content: payload.message,
      createdAt: payload.createdAt,
      isSender: false,
    },
  ];

  chatMessagesSkip.value += 1;
}

onMounted(async () => {
  appStore.setIsGoBackButtonVisible(true);
  appStore.setIsSideNavHidden(true);
  appStore.setGoBackAction(function () {
    window.location.href = "/my-sessions";
  });

  await getChatMessages();

  appStore.setIsLoading(false);

  $sessionsSocket.emit("session:join", {
    sessionId: Number(route.params.id),
  });
  $sessionsSocket.on("session:new-producer", handleNewProducer);
  $sessionsSocket.on("session:chat:message", handleNewChatMessage);
  $sessionsSocket.on("session:leave", () => {
    isRemoteVideoAvailable.value = false;
  });

  await createSendTransport();

  const producerData = await sessionsStore.getProducerData(
    Number(route.params.id),
  );

  if (!producerData) {
    return;
  }
  const audioPayload: NewProducerPayload = {
    sessionId: producerData.sessionId,
    producerId: String(producerData.producerAudioId),
    producerUserId: producerData.producerUserId,
    kind: "audio",
  };
  const videoPayload: NewProducerPayload = {
    sessionId: producerData.sessionId,
    producerId: String(producerData.producerVideoId),
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
