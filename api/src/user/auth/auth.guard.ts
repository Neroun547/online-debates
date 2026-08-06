import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const request = context.switchToHttp().getRequest();
            const token = this.extractTokenFromRequest(request);

            if(!token) {
                throw new UnauthorizedException();
            }
            const jwtSecret = this.configService.getOrThrow("USER_AUTH_JWT_SECRET");

            const user = await this.jwtService.verifyAsync(token, { secret: jwtSecret });

            request.user = user;
        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }
    
    private extractTokenFromRequest(request): string | null {
        if(!request.headers.authorization) {
            return null;
        }
        return request.headers.authorization.replace("Bearer ", "");
    }
}

