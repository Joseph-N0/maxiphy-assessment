// Nest imports
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";

// Modules
import { UserModule } from "./modules/user/user.module";
import { AuthModule } from "./auth/auth.module";

// Middlewares
import { JwtTokenMiddleware } from "./auth/middleware/jwtToken.middleware";

@Module({
    imports: [
        // Database - Prisma
        PrismaModule,

        // Configuration
        ConfigModule.forRoot({
            isGlobal: true,
        }),

        // Modules
        AuthModule,
        UserModule,
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(JwtTokenMiddleware).forRoutes("*");
    }
}
