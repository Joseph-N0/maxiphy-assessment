import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services";
import { setAccessTokenCookie } from "../utils/cookie.util";
import { ConfigService } from "@nestjs/config";

/**
 * @description This middleware only checks for expired or near expiry tokens and try to refresh them
 * in case of failure for both tokens, clears them
 */
@Injectable()
export class JwtTokenMiddleware implements NestMiddleware {
    constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
    ) {}

    async use(req: Request, res: Response, next: NextFunction) {
        const token = req.cookies["at"];
        const refreshToken = req.cookies["rt"];

        if (!token) {
            return next();
        }

        try {
            // Check if the token is valid
            await this.authService.verifyJWT(token);
        } catch (error) {
            // If token is invalid, clear the cookie and continue
            res.clearCookie("at");
            if (error.name === "TokenExpiredError" && refreshToken) {
                try {
                    // Try to refresh the token
                    const newAccessToken = await this.authService.refreshAccessToken(refreshToken);
                    setAccessTokenCookie(res, newAccessToken);
                } catch (refreshError) {
                    res.clearCookie("rt");
                }
            } else {
                res.clearCookie("rt");
            }
        }

        next();
    }
}
