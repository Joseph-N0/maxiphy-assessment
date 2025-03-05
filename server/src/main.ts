import { NestFactory } from "@nestjs/core";
import type { NestExpressApplication } from "@nestjs/platform-express";
import * as bodyparser from "body-parser";
import { middleware } from "./auth/middleware";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as dotenv from "dotenv";
import * as cookieParser from "cookie-parser";
import { ValidationPipe } from "@nestjs/common";

dotenv.config();

function validateEnv() {
    const requiredEnvVariables = ["NODE_ENV", "PORT", "DATABASE_URL"];
    const missingVariables = requiredEnvVariables.filter((variable) => !(variable in process.env));

    if (missingVariables.length > 0) {
        throw new Error(`Missing required environment variables: ${missingVariables.join(", ")}`);
    }
}

async function bootstrap(): Promise<void> {
    validateEnv();

    const isProduction = process.env.NODE_ENV === "production";
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.setGlobalPrefix("api");

    app.use(cookieParser());
    app.use(bodyparser.json());

    app.disable("x-powered-by");

    // Express Middleware
    middleware(app);

    app.enableCors({
        origin: ["http://localhost:3000"],
        credentials: true, // Allow cookies and credentials
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS",
        allowedHeaders: "Content-Type, Authorization",
    });

    // Enable global validation pipe
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
        }),
    );

    if (isProduction) {
        app.enable("trust proxy");
    } else {
        const options = new DocumentBuilder()
            .setTitle("OpenAPI Documentation")
            .setDescription("The sample API description")
            .setVersion("1.0")
            .build();
        const document = SwaggerModule.createDocument(app, options);
        SwaggerModule.setup("swagger", app, document);
    }

    await app.listen(parseInt(process.env.PORT) || 5000);
    console.log(`Server is running`);
}

bootstrap();
