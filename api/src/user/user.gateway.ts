import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { UserServiceDb } from "src/db/user/user.service";
import { Socket } from "socket.io";
import { UserStatus } from "src/db/user/user.entity";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import * as dotenv from "dotenv";

dotenv.config();

interface UserJwtPayload {
    id: number;
    email: string;
    username: string;
    timezone: string;
}

@WebSocketGateway({
    namespace: "/user",
    cors: {
        origin: process.env.CLIENT_CORS_ORIGIN ?? 'http://localhost:3103',
    },
})
export class UserStateWebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    private server;
    
    constructor(
        private userService: UserServiceDb,
        private jwtService: JwtService,
        private configService: ConfigService
    ) {

    }
    
    async handleConnection(client: Socket) {
        
        if(!client.handshake || !client.handshake.auth || !client.handshake.auth.token) {
            throw new WsException("Auth error");
        }
        try {
            const user = await this.extractUserFromToken(client.handshake.auth.token);

            client.data.user = user;
        } catch(error) {
            throw new WsException("Auth error");
        }
    }
    async handleDisconnect(client: Socket) {
        const user = this.extractUserFromClient(client);

        if(user) {
            await this.userService.updateById(user.id, { status: UserStatus.OFFLINE });
        }
    }
    private extractUserFromClient(client: Socket): UserJwtPayload | null {
        return (client.data && client.data.user) ? client.data.user : null;
    }
    private async extractUserFromToken(token: string | undefined): Promise<UserJwtPayload | null> {
        if(!token) {
            return null;
        }
        const jwtSecret = this.configService.getOrThrow("USER_AUTH_JWT_SECRET");
        const user = await this.jwtService.verifyAsync(token, { secret: jwtSecret });

        return {
            id: user.id,
            email: user.email,
            username: user.username,
            timezone: user.timezone
        };
    }
}

