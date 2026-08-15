import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from "@nestjs/common";
import { WebRTCService } from "src/integrations/webRTC/webRTC.service";
import { AuthGuard } from "src/user/auth/auth.guard";
import { SessionsGateway } from "./sessions.gateway";

@UseGuards(AuthGuard)
@Controller("/user/sessions/:sessionId/webRTC")
export class WebRTCController {
    constructor(
        private webRTCService: WebRTCService,
        private sessionsGateway: SessionsGateway
    ) {

    }
    
    @Get("producer-data")
    async getProducerData(@Param("sessionId", new ParseIntPipe()) sessionId: number, @Req() req: Request) {
        return await this.webRTCService.getProducerData(req["user"].id, sessionId);
    }

    @Post("init")
    async startWebRTCSession(@Param("sessionId", new ParseIntPipe()) sessionId: number, @Body() body, @Req() req: Request) {
        const transport = await this.webRTCService.initSession(sessionId, body.direction, req["user"].id);

        return transport;
    }

    @Post("transport-connect")
    async transportConnect(@Param("sessionId", new ParseIntPipe()) sessionId: number, @Req() req: Request, @Body() body) {
        await this.webRTCService.transportConnect(body, sessionId, body.direction, req["user"].id);

        return;
    }

    @Post("transport-produce-data")
    async transportProduceData(@Param("sessionId", new ParseIntPipe()) sessionId: number, @Req() req: Request, @Body() body) {
        const result = await this.webRTCService.produceData(body, sessionId, req["user"].id);

        return { id: result };
    }

    @Post("transport-produce")
    async produce(@Param("sessionId", new ParseIntPipe()) sessionId: number, @Req() req: Request, @Body() body) {
        const result = await this.webRTCService.produce(body, sessionId, req["user"].id);

        if(result) {
            this.sessionsGateway.emitNewProducer({
                sessionId,
                producerId: result,
                producerUserId: req["user"].id,
                kind: body.kind
            });
        }

        return { id: result };
    }

    @Post("consume")
    async consume(@Body() body, @Req() req, @Param("sessionId", new ParseIntPipe()) sessionId: number) {
        return await this.webRTCService.consume({
            producerId: body.producerId,
            rtpCapabilities: body.rtpCapabilities,
            userId: req["user"].id,
            sessionId: sessionId
        }); 
    }

    @Post("consumer-resume")
    async resumeConsume(@Body() body, @Req() req, @Param("sessionId", new ParseIntPipe()) sessionId: number) {
        await this.webRTCService.resumeConsume({
            consumerId: body.consumerId,
            sessionId: sessionId,
            userId: req["user"].id
        });
        return;
    }
}
