import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import * as jwt from "jsonwebtoken";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
    handleRequest(err, user, info, context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();

        const token = request.cookies["at"];
        if (err || !token) throw err || new UnauthorizedException("You are not authorized to access this resource");

        const decoded = jwt.decode(token) as jwt.JwtPayload;

        user = { id: decoded.id, email: decoded.email } as Express.User;

        return user;
    }
}
