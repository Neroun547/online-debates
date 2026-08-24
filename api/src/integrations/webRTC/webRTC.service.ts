import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as mediasoup from "mediasoup";
import { InitWebRTCSessionResponseInterface } from "src/sessions/dto/init-webRTC-session-response.dto";

interface UserTransporters {
    consumeTransporter?: mediasoup.types.WebRtcTransport;
    produceTransporter?: mediasoup.types.WebRtcTransport;
    consumers: Map<string, mediasoup.types.Consumer>;
    producerVideoId?: string;
    producerAudioId?: string;
}

interface Room {
    router: mediasoup.types.Router;
    users: Map<number, UserTransporters>;
}

const rooms = new Map<number, Room>();

const mediaCodecs = [
    {
        kind: 'audio',
        mimeType: 'audio/opus',
        clockRate: 48000,
        channels: 2,
    },
    {
        kind: 'video',
        mimeType: 'video/VP8',
        clockRate: 90000,
    },
    {
        kind: "audio",
        mimeType: "audio/opus",
        clockRate: 48000,
        channels: 2
    },
    {
        kind: "video",
        mimeType: "video/H264",
        clockRate: 90000,
        parameters : {
            "packetization-mode": 1,
            "profile-level-id": "42e01f",
            "level-asymmetry-allowed": 1
        }
    }
];

@Injectable()
export class WebRTCService {
    private worker: mediasoup.types.Worker<mediasoup.types.AppData> | undefined;
    private webRTCServer;

    constructor(private configService: ConfigService) {

    }

    disconnectAllUserTransports(userId: number, sessionsIds: Array<number>) {
        for(const sessionId of sessionsIds) {
            const transports = this.getTransporters(userId, sessionId);

            if(transports) {
                transports.consumers.forEach(item => item.close());
                transports.consumeTransporter?.close();
                transports.produceTransporter?.close();
            }
            const room = rooms.get(sessionId);
            
            if(room?.users.get(userId)) {
                room.users.delete(userId);
            }
        }
    }

    createWorker() {
        const worker = mediasoup.createWorker({

        });

        return worker;
    }

    async initSession(sessionId: number, direction: "send" | "recv", userId: number): Promise<InitWebRTCSessionResponseInterface> {
        if(!this.worker) {
            this.worker = await this.createWorker();
        }
        if(!this.webRTCServer) {
            this.webRTCServer = await this.worker.createWebRtcServer(
        {
            listenInfos : [
            {
                protocol: 'udp',
                ip: this.configService.getOrThrow("WEB_RTC_UDP_IP"),
                announcedAddress: this.configService.getOrThrow("WEB_RTC_UDP_ANNOUNCED_ADDRESS"),
                port: 20000
            },
            {
                protocol: 'tcp',
                ip: this.configService.getOrThrow("WEB_RTC_TCP_IP"),
                announcedAddress: this.configService.getOrThrow("WEB_RTC_TCP_ANNOUNCED_ADDRESS"),
                port: 20000
            }
            ]
        });
        }
        let room = rooms.get(sessionId);

        if(!room) {
            const router = await this.worker.createRouter({ 
                //@ts-ignore
                mediaCodecs 
            });

            room = {
                router,
                users: new Map<number, UserTransporters>()
            };
            rooms.set(sessionId, room);
        }
        let userTransporters = room.users.get(userId);

        if(!userTransporters) {
            userTransporters = {
                consumers: new Map()
            };
            room.users.set(userId, userTransporters);
        }
        const existingTransport = direction === "send"
            ? userTransporters.produceTransporter
            : userTransporters.consumeTransporter;

        if(existingTransport) {
            return {
                transportId: existingTransport.id,
                iceParameters: existingTransport.iceParameters,
                iceCandidates: existingTransport.iceCandidates,
                dtlsParameters: existingTransport.dtlsParameters,
                routerRtpCapabilities: room.router.rtpCapabilities
            };
        }
        const transport = await room.router.createWebRtcTransport({
            webRtcServer: this.webRTCServer,
            enableUdp: true,
            enableTcp: true,
            preferUdp: true,
        });

        if(direction === "send") {
            userTransporters.produceTransporter = transport;
        } else {
            userTransporters.consumeTransporter = transport;
        }
        return {
            transportId: transport.id,
            iceParameters: transport.iceParameters,
            iceCandidates: transport.iceCandidates,
            dtlsParameters: transport.dtlsParameters,
            routerRtpCapabilities: room.router.rtpCapabilities
        };
    }

    async transportConnect(body, sessionId: number, direction: "send" | "recv", userId: number): Promise<void> {
        const transporters = this.getTransporters(userId, sessionId);
        
        if(!transporters) {
            throw new NotFoundException({ message: "Transport not found" });
        }
        if(direction === "send") {
            if(!transporters.produceTransporter) {
                throw new NotFoundException({ message: "Send transport not found" });
            }
            try {
                await transporters.produceTransporter.connect({
                    dtlsParameters: body.dtlsParameters
                });
            } catch(error) {
                console.log("Error ", error);
            }
        } else {
            if(!transporters.consumeTransporter) {
                throw new NotFoundException({ message: "Receive transport not found" });
            }
            await transporters.consumeTransporter.connect({
                dtlsParameters: body.dtlsParameters
            });
        }
    }

    async produce(body, sessionId: number, userId: number): Promise<string | undefined> {
        const transporters = this.getTransporters(userId, sessionId);

        if(!transporters) {
            throw new NotFoundException({ message: "Transport not found" });
        }
        if(!transporters.produceTransporter) {
            throw new NotFoundException({ message: "Send transport not found" });
        }
        const producer = await transporters.produceTransporter.produce(
        {
            kind: body.kind,
            rtpParameters: body.rtpParameters
        });
        const room = rooms.get(sessionId);
        const userInMap = room?.users.get(userId);

        if(userInMap && body.kind === "video") {
            room?.users.set(userId, {
                ...userInMap,
                producerVideoId: producer.id
            });
        }
        if(userInMap && body.kind === "audio") {
            room?.users.set(userId, {
                ...userInMap,
                producerAudioId: producer.id
            });
        }
        return producer.id;
    }

    async produceData(body, sessionId: number, userId: number) {
        const transporters = this.getTransporters(userId, sessionId);

        if(!transporters) {
            throw new NotFoundException({ message: "Transporters not found" });
        }
        if(!transporters.produceTransporter) {
            throw new NotFoundException({ message: "Send transport not found" });
        }
        const dataProducer = await transporters.produceTransporter.produceData({
            sctpStreamParameters: body.sctpStreamParameters,
            label: body.label,
            protocol: body.protocol
        });

        return dataProducer.id;
    }

    async resumeConsume(params: {
        consumerId: string;
        sessionId: number;  
        userId: number; 
    }) {
        const room = rooms.get(params.sessionId);

        if(!room) {
            throw new NotFoundException({ message: "Room not found" });
        }
        const transporters = room.users.get(params.userId);

        if(!transporters?.consumeTransporter) {
            throw new NotFoundException({
                message: "Receive transport not found"
            });
        }
        const consumer = transporters.consumers.get(params.consumerId);

        if(!consumer) {
            throw new NotFoundException({ message: "Consumer not found" });
        }
        await consumer?.resume();
    }

    async consume(params: {
        producerId: string;
        rtpCapabilities: mediasoup.types.RtpCapabilities;
        userId: number;
        sessionId: number;
    }) {
        const room = rooms.get(params.sessionId);

        if(!room) {
            throw new NotFoundException({
                message: "Room not found",
            });
        }
        const transporters = room.users.get(params.userId);

        if (!transporters?.consumeTransporter) {
            throw new NotFoundException({
                message: "Receive transport not found",
            });
        }
        if (!room.router.canConsume({ producerId: params.producerId, rtpCapabilities: params.rtpCapabilities})) {
            throw new BadRequestException({
                message: "Cannot consume producer",
            });
        }
        const consumer = await transporters.consumeTransporter.consume({
            producerId: params.producerId,
            rtpCapabilities: params.rtpCapabilities,
            paused: true,
        });
        transporters.consumers.set(consumer.id, consumer);

        consumer.on("transportclose", () => {
            transporters.consumers.delete(consumer.id);
        });
        consumer.on("producerclose", () => {
            transporters.consumers.delete(consumer.id);
        });

        return {
            id: consumer.id,
            producerId: consumer.producerId,
            kind: consumer.kind,
            rtpParameters: consumer.rtpParameters,
        };
    }

    async getProducerData(currentUserId: number, sessionId: number) {
        const room = rooms.get(sessionId);

        if(!room) {
            throw new NotFoundException({ message: "Producer not found" });
        }
        for (let [key, value] of room.users.entries()) {
            if(key !== currentUserId) {
                if(!value.produceTransporter) {
                    throw new NotFoundException();
                }
                return {
                    sessionId: sessionId,
                    producerVideoId: value.producerVideoId,
                    producerAudioId: value.producerAudioId,
                    producerUserId: key
                };
            }
        }
    }

    private getTransporters(userId: number, sessionId: number): UserTransporters | null {
        const room = rooms.get(sessionId);

        if(!room) {
            return null;
        }
        return room.users.get(userId) ?? null;
    }
}
