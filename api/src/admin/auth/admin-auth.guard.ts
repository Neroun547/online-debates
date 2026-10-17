import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AdminAuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const request = await context.switchToHttp().getRequest();
            const token = this.extractTokenFromRequest(request);

            const user = await this.jwtService.verifyAsync(token, {
                secret: this.configService.getOrThrow("ADMIN_AUTH_JWT_SECRET"),
            });

            request["user"] = user;

            return true;
        } catch {
            throw new UnauthorizedException();
        }
    }
    private extractTokenFromRequest(request: any): string {
        if (!request.headers.authorization) {
            return "";
        }
        return request.headers.authorization.replace("Bearer ", "");
    }
}
