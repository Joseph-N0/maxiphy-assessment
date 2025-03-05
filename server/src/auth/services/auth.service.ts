import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UserService } from "../../modules/user/services/user.service";
import { verifyPassword } from "../../common/utils/auth.util";
import { JWTPayload } from "../interfaces";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async validateUser(email: string, pass: string) {
        const user = await this.userService.findUserByEmail(email);
        if (user) {
            const verified = await verifyPassword(user.password, pass);
            if (verified) {
                const { password, ...result } = user;
                return result;
            }
        }
        return null;
    }

    /**
     *
     * @returns encrypted access token
     */
    async login(userPayload: JWTPayload) {
        const signedToken = this.jwtService.sign(userPayload);
        const signedRefreshToken = this.jwtService.sign(userPayload, {
            expiresIn: this.configService.get<string>("JWT_REFRESH_EXPIRATION_TIME"),
        });
        return {
            access_token: signedToken,
            refresh_token: signedRefreshToken,
        };
    }

    /**
     *
     * @returns access token
     */
    async refreshAccessToken(refreshToken: string) {
        const decoded = this.jwtService.verify(refreshToken);
        const payload = decoded as JWTPayload;

        return this.jwtService.sign(payload);
    }

    async verifyJWT(token: string) {
        return this.jwtService.verify(token);
    }
}
