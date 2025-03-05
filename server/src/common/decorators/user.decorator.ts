import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { JWTPayload } from "src/auth/interfaces";

/**
 * @returns The User Object from the authenticated request
 */
export const User = createParamDecorator((data: unknown, ctx: ExecutionContext): JWTPayload => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
});
