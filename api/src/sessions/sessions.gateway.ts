import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SessionsServiceDb } from 'src/db/sessions/sessions.service';
import { WebRTCService } from 'src/integrations/webRTC/webRTC.service';
import { SessionsService } from './service/sessions.service';
import { parseMessageDateForRecipient } from './utils/utils';
import { MessagesDomainInterface } from 'src/db/messages/interfaces/messages.interfaces';
import * as dotenv from "dotenv";
import { MailerService } from 'src/integrations/mailer/mailer.service';

dotenv.config();

interface UserJwtPayload {
  id: number;
  email: string;
  username: string;
  timezone: string;
}

interface SessionPayload {
  sessionId: number;
}

interface SessionChatMessagePayload {
  sessionId: number;
  message: string;
  date: string;
}

interface NewProducerPayload {
  sessionId: number;
  producerId: string;
  producerUserId: number;
  kind: 'audio' | 'video';
}

interface ClientToServerEvents {
  'session:join': (payload: SessionPayload) => void;
  'session:leave': (payload: SessionPayload) => void;
}

interface ServerToClientEvents {
  'session:error': (payload: { message: string }) => void;
  'session:new-producer': (payload: NewProducerPayload) => void;
  'session:chat:message': (payload: { message: string; createdAt: string; }) => void;
  'session:leave': () => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SessionSocketData {
  user?: UserJwtPayload;
  sessionsIds?: Array<number>;
}

type SessionSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SessionSocketData
>;

type SessionServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SessionSocketData
>;

@WebSocketGateway({
  namespace: '/sessions',
  cors: {
    origin: process.env.CLIENT_CORS_ORIGIN ?? 'http://192.168.1.100:3103',
  },
})
export class SessionsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  private server!: SessionServer;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly sessionsServiceDb: SessionsServiceDb,
    private readonly sessionsService: SessionsService,
    private readonly webRTCService: WebRTCService,
    private readonly mailerService: MailerService
  ) {}

  handleDisconnect(client: SessionSocket) {
      if(client.data.user && client.data.sessionsIds) {
          this.webRTCService.disconnectAllUserTransports(client.data.user.id, client.data.sessionsIds);
      }
      if(client.data.user && client.data.sessionsIds) {
        for(const sessionId of client.data.sessionsIds) {
          this.server.to(this.getSessionRoomName(sessionId)).except(this.getUserRoomName(client.data.user.id)).emit("session:leave");
        }
      }
  }

  async handleConnection(client: SessionSocket): Promise<void> {
    try {
      const token = this.extractToken(client);

      if (!token) {
        throw new Error('Missing access token');
      }
      const user = await this.jwtService.verifyAsync<UserJwtPayload>(token, {
        secret: this.configService.getOrThrow('USER_AUTH_JWT_SECRET'),
      });

      client.data.user = user;
      
      await client.join(this.getUserRoomName(user.id));
    } catch {
      client.emit('session:error', { message: 'Unauthorized' });
      client.disconnect(true);
    }
  }

  @SubscribeMessage("session:chat:message")
  async sendMessage(
    @ConnectedSocket() client: SessionSocket,
    @MessageBody() payload: SessionChatMessagePayload
  ) {
    if(!payload || !payload.message) {
      return;
    }
    const sessionId = this.validateSessionId(payload.sessionId);
    const user = this.getAuthenticatedUser(client);
    const sessionInDb = await this.sessionsServiceDb.findByIdAndUserIdWithSenderAndRecipient(sessionId, user.id);
    
    if(!sessionInDb) {
      throw new WsException('Session not found');
    }
    const recipientUser = sessionInDb.creatorId !== user.id ? user : sessionInDb.customer;

    if(!recipientUser) {
      throw new WsException("User not found");
    }
    let savedMessage: MessagesDomainInterface | undefined;

    try {
      savedMessage = await this.sessionsService.saveMessageAndReturn({
        content: payload.message.trim(),
        senderId: user.id,
        sessionId: sessionId,
        date: payload.date
      });
    } catch(error) {
      throw new WsException('Save message error');
    }
    this.server
      .to(this.getSessionRoomName(sessionId))
      .except(this.getUserRoomName(user.id))
      .emit("session:chat:message", { message: payload.message, createdAt: parseMessageDateForRecipient(savedMessage.createdAt, recipientUser.timezone) });
  }

  @SubscribeMessage('session:join')
  async joinSession(
    @ConnectedSocket() client: SessionSocket,
    @MessageBody() payload: SessionPayload,
  ): Promise<{ sessionId: number }> {
    const sessionId = this.validateSessionId(payload.sessionId);
    const user = this.getAuthenticatedUser(client);
    const isParticipant = await this.sessionsServiceDb.isUserParticipant(
      sessionId,
      user.id,
    );

    if (!isParticipant) {
      throw new WsException('Session not found');
    }
    const sessionInDb = await this.sessionsServiceDb.findByIdWithCreatorAndCustomer(sessionId);

    await client.join(this.getSessionRoomName(sessionId));

    
    const sendToUser = sessionInDb?.creator?.email === user.email ? sessionInDb.customer : sessionInDb?.creator;

    if(sendToUser) {
      const joinSessionMailFrom = this.configService.getOrThrow("JOIN_SESSION_MAIL_FROM");
      const baseSessionLink = this.configService.getOrThrow("BASE_SESSION_LINK");

      this.mailerService.sendMailWithHtml({
        from: joinSessionMailFrom,
        to: sendToUser.email,
        subject: this.mailerService.getUserStartedSessionLetterSubject((sendToUser.language) as "ru" | "en" | "uk" ?? "en"),
        html: this.mailerService.getTemplateForSessionStartNotification(
          user.email,
          (sendToUser.language) as "ru" | "en" | "uk" ?? "en", 
          baseSessionLink + sessionId
        )
      })  
      .catch((error) => {
        console.log("session:join send mail error", error);
      });
    }

    if(client.data.sessionsIds) {
        client.data.sessionsIds.push(sessionId);
    } else {
        client.data.sessionsIds = [sessionId];
    }    
    return { sessionId };
  }

  @SubscribeMessage('session:leave')
  async leaveSession(
    @ConnectedSocket() client: SessionSocket,
    @MessageBody() payload: SessionPayload,
  ): Promise<{ sessionId: number }> {
    const sessionId = this.validateSessionId(payload?.sessionId);

    this.getAuthenticatedUser(client);
    await client.leave(this.getSessionRoomName(sessionId));

    return { sessionId };
  }

  emitNewProducer(payload: NewProducerPayload): void {
    this.server
      .to(this.getSessionRoomName(payload.sessionId))
      .except(this.getUserRoomName(payload.producerUserId))
      .emit('session:new-producer', payload);
  }

  private extractToken(client: SessionSocket): string | null {
    if(!client.handshake || !client.handshake.auth || !client.handshake.auth.token || typeof client.handshake.auth.token !== "string") {
      return null;
    }
    return client.handshake.auth.token;
  }

  private getAuthenticatedUser(client: SessionSocket): UserJwtPayload {
    const user = client.data.user;

    if (!user) {
      throw new WsException('Unauthorized');
    }
    return user;
  }

  private validateSessionId(sessionId: number): number {
    if (!Number.isInteger(sessionId) || sessionId < 1) {
      throw new WsException('Invalid session id');
    }
    return sessionId;
  }

  private getSessionRoomName(sessionId: number): string {
    return `session:${sessionId}`;
  }

  private getUserRoomName(userId: number): string {
    return `user:${userId}`;
  }
}
