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
    app.use(helmet());

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
