// Nest imports
import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { ConfigModule } from "@nestjs/config";

@Module({
    imports: [
        // Database - Prisma
        PrismaModule,

        // Configuration
        ConfigModule.forRoot({
            isGlobal: true,
        }),
    ],
})
export class AppModule {}
