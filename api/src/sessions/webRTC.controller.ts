import { Body, Controller, Get, Param, ParseIntPipe, Post, UseGuards } from "@nestjs/common";
import { WebRTCService } from "src/integrations/webRTC/webRTC.service";
import { AuthGuard } from "src/user/auth/auth.guard";
import { SessionsGateway } from "./sessions.gateway";
import { InitWebRTCSessionResponseInterface } from "./dto/init-webRTC-session-response.dto";
import { InitWebRTCSessionRequestDto } from "./dto/init-webRTC-session-request.dto";
import { TransportConnectRequestDto } from "./dto/transport-connect-request.dto";
import { TransportProduceDataRequestDto } from "./dto/transport-produce-data-request.dto";
import { TransportProduceRequestDto } from "./dto/transport-produce-request.dto";
import { ConsumeRequestDto } from "./dto/consume-request.dto";
import { ConsumerResumeRequestDto } from "./dto/consumer-resume-request.dto";
import { User } from "src/user/auth/decorators/user.decorator";
import type { UserDomainInterface } from "src/db/user/interfaces/user.interfaces";

@UseGuards(AuthGuard)
@Controller("/user/sessions/:sessionId/webRTC")
export class WebRTCController {
    constructor(
        private webRTCService: WebRTCService,
        private sessionsGateway: SessionsGateway
    ) {

    }
    
    @Get("producer-data")
    async getProducerData(@Param("sessionId", new ParseIntPipe()) sessionId: number, @User() user: UserDomainInterface) {
        return await this.webRTCService.getProducerData(user.id, sessionId);
    }

    @Post("init")
    async startWebRTCSession(@Param("sessionId", new ParseIntPipe()) sessionId: number, @Body() body: InitWebRTCSessionRequestDto, @User() user: UserDomainInterface): Promise<InitWebRTCSessionResponseInterface> {
        const transport = await this.webRTCService.initSession(sessionId, body.direction, user.id);

        return transport;
    }

    @Post("transport-connect")
    async transportConnect(@Param("sessionId", new ParseIntPipe()) sessionId: number, @User() user: UserDomainInterface, @Body() body: TransportConnectRequestDto) {
        await this.webRTCService.transportConnect(body, sessionId, body.direction, user.id);

        return;
    }

    @Post("transport-produce-data")
    async transportProduceData(@Param("sessionId", new ParseIntPipe()) sessionId: number, @User() user: UserDomainInterface, @Body() body: TransportProduceDataRequestDto) {
        const result = await this.webRTCService.produceData(body, sessionId, user.id);

        return { id: result };
    }

    @Post("transport-produce")
    async produce(@Param("sessionId", new ParseIntPipe()) sessionId: number, @User() user: UserDomainInterface, @Body() body: TransportProduceRequestDto) {
        const result = await this.webRTCService.produce(body, sessionId, user.id);

        if(result) {
            this.sessionsGateway.emitNewProducer({
                sessionId,
                producerId: result,
                producerUserId: user.id,
                kind: body.kind
            });
        }

        return { id: result };
    }

    @Post("consume")
    async consume(@Body() body: ConsumeRequestDto, @User() user: UserDomainInterface, @Param("sessionId", new ParseIntPipe()) sessionId: number) {
        return await this.webRTCService.consume({
            producerId: body.producerId,
            rtpCapabilities: body.rtpCapabilities,
            userId: user.id,
            sessionId: sessionId
        }); 
    }

    @Post("consumer-resume")
    async resumeConsume(@Body() body: ConsumerResumeRequestDto, @User() user: UserDomainInterface, @Param("sessionId", new ParseIntPipe()) sessionId: number) {
        await this.webRTCService.resumeConsume({
            consumerId: body.consumerId,
            sessionId: sessionId,
            userId: user.id
        });
        return;
    }
}
