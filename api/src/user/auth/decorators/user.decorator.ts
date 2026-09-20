
import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { UserDomainInterface } from 'src/db/user/interfaces/user.interfaces';

export const User = createParamDecorator<UserDomainInterface>(
  (data: unknown, ctx: ExecutionContext): UserDomainInterface => {
    const request = ctx.switchToHttp().getRequest();
    
    if(!request.user) {
      throw new UnauthorizedException();
    }
    return {
        id: request.user.id,
        username: request.user.username,
        email: request.user.email,
        status: request.user.status,
        timezone: request.user.timezone,
        isAvailableForPermanentSessions: request.user.isAvailableForPermanentSessions,
        language: request.user.language
    };
  },
);
