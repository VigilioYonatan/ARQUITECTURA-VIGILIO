import environments, {
    validateEnvironments,
} from "@infrastructure/config/server/environments.config";
import { astroProxy } from "@infrastructure/libs/server/astro-proxy";
import { WebPath } from "@modules/web/web.routers";
import { VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { apiReference } from "@scalar/nestjs-api-reference";
import helmet from "helmet";
import { Logger } from "nestjs-pino";
import { AppModule } from "./app.module";

async function bootstrap() {
    // Validar variables de entorno ANTES de iniciar NestJS
    validateEnvironments();

    const app = await NestFactory.create(AppModule, { bufferLogs: true });

    app.useLogger(app.get(Logger));

    // Security Headers
    app.use(
        helmet({
            contentSecurityPolicy: {
                // Configura aunque sea una política básica
                directives: {
                    defaultSrc: ["'self'"],
                    scriptSrc: [
                        "'self'",
                        `http://localhost:${environments().PUBLIC_PORT}`, // Permite scripts desde Vite (dev)
                        "'unsafe-inline'", // Necesario para Vite en desarrollo
                        "'unsafe-eval'", // Necesario para HMR (Hot Module Replacement)
                        "https://www.google.com", // Allow Google domains
                        "https://www.gstatic.com",
                        "https://cearlatinoamericano.pe", // Permitir TinyMCE
                        "https://064b67e3357a.ngrok-free.app",
                        "wss://campus.cearlatinoamericano.pe",
                        "ws://campus.cearlatinoamericano.pe",
                        "https://cdn.jsdelivr.net",
                        // `ws://${environments().PUBLIC_URL}`,
                    ],
                    connectSrc: [
                        "'self'",
                        `http://localhost:${environments().PUBLIC_PORT}`, // Permite conexiones a Vite (websockets)
                        `ws://${environments().PUBLIC_URL}`, // WebSockets para HMR
                        "https://cearlatinoamericano.pe",
                        "wss://cearlatinoamericano.pe",
                        "ws://campus.cearlatinoamericano.pe",
                        "wss://campus.cearlatinoamericano.pe",
                        "https://064b67e3357a.ngrok-free.app",
                        "https://cdn.jsdelivr.net",
                        environments().PUBLIC_URL,
                    ],
                    frameSrc: [
                        "'self'",
                        "https://www.google.com", // Required for reCAPTCHA
                        "https://www.recaptcha.net", // Alternative domain
                        "https://www.youtube.com",
                    ],
                    imgSrc: [
                        "'self'",
                        "data:",
                        "blob:",
                        "https://akamai.sscdn.co",
                        "https://picsum.photos",
                        "https://cdn.jsdelivr.net",
                        "https://avatars.githubusercontent.com",
                        "https://cearlatinoamericano.edu.pe",
                        "https://cearlatinoamericano.pe",
                    ],
                    styleSrc: [
                        "'self'",
                        "'unsafe-inline'",
                        "https://cdn.jsdelivr.net",
                    ],
                    mediaSrc: ["'self'", "data:", "blob:"],

                    // Añade más según necesites
                },
            },
            dnsPrefetchControl: true,
            frameguard: { action: "deny" },
            hidePoweredBy: true,
            hsts: { maxAge: 31536000, includeSubDomains: true }, // Solo si usas HTTPS
            ieNoOpen: true,
            noSniff: true,
            xssFilter: false, // Opcional: Mejor depender de CSP
            // Considera añadir:
            referrerPolicy: { policy: "strict-origin-when-cross-origin" },
        })
    );

    // Enable CORS
    const corsOrigins = environments().CORS_ORIGINS;
    app.enableCors({
        origin:
            corsOrigins === "*"
                ? "*"
                : corsOrigins.split(",").map((s) => s.trim()),
        credentials: true,
    });

    // Versioning
    app.setGlobalPrefix("api", { exclude: Object.values(WebPath) });
    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: "1",
        prefix: "v",
    });

    // Swagger Configuration
    const config = new DocumentBuilder()
        .setTitle("Astro-Test API")
        .setDescription("API documentation for Astro-Test project")
        .setVersion("1.0")
        .addTag("users")
        .build();
    const document = SwaggerModule.createDocument(app, config);

    app.use(
        "/reference",
        apiReference({
            content: document,
        })
    );

    // Session & Passport Configuration
    // setupSession(app);

    // strategies
    // passport.use(localStrategy());
    // passport.use(jwtStrategy());

    // Start on port

    const server = await app.listen(environments().PORT);
    server.on("upgrade", astroProxy.upgrade);
    // biome-ignore lint/suspicious/noConsole: Startup log
    console.log(
        `Application is running on: http://localhost:${environments().PORT}`
    );
    // biome-ignore lint/suspicious/noConsole: Startup log
    console.log(
        `Swagger Docs available at: http://localhost:${
            environments().PORT
        }/reference`
    );
}
bootstrap();
