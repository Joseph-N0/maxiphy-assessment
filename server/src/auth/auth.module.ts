// Nest imports
import { Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";

// auth
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "./strategy/jwt.strategy";
import { PassportModule } from "@nestjs/passport";

// modules
import { UserModule } from "../modules/user/user.module";

// controllers and services
import { AuthController } from "./controllers";
import { AuthService } from "./services";

// others
import * as dotenv from "dotenv";
import { UnauthorizedExceptionFilter } from "src/common/filters/unauthorizedException.filter";

dotenv.config();

@Module({
    imports: [
        UserModule,
        PassportModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET_KEY,
            signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME },
        }),
    ],
    controllers: [AuthController],
    providers: [
        {
            provide: APP_FILTER,
            useClass: UnauthorizedExceptionFilter,
        },
        AuthService,
        JwtStrategy,
    ],
    exports: [AuthService],
})
export class AuthModule {}
