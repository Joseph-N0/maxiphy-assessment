import type { INestApplication } from "@nestjs/common";
import * as compression from "compression";
import helmet from "helmet";
import * as passport from "passport";

export function middleware(app: INestApplication): INestApplication {
    const isProduction = process.env.NODE_ENV === "production";

    app.use(compression());
    app.use(passport.initialize());

    app.use(
        helmet({
            contentSecurityPolicy: isProduction ? undefined : false,
            crossOriginEmbedderPolicy: isProduction ? undefined : false,
        }),
    );

    app.use(helmet.noSniff());
    app.use(helmet.hidePoweredBy());

    return app;
}
