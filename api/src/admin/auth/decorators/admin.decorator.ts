import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { AdminDomainInterface } from "src/db/admin/interfaces/admin.interfaces";

export const Admin = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): AdminDomainInterface => {
        const request = ctx.switchToHttp().getRequest();

        return {
            id: request.user.id,
            email: request.user.email,
        };
    },
);
