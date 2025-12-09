import enviroments from "@infrastructure/config/server/environments.config";
import { WebPath } from "@modules/web/web.routers";
import { VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { Logger } from "nestjs-pino";
import { AppModule } from "./app.module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { bufferLogs: true });

    app.useLogger(app.get(Logger));
    // Security Headers
    // app.use(helmet());

    // Enable CORS
    // app.enableCors();

    // Versioning
    app.setGlobalPrefix("api", { exclude: Object.values(WebPath) });
    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: "1",
        prefix: "v",
    });

    // Swagger Configuration
    // const config = new DocumentBuilder()
    //     .setTitle("Template App API")
    //     .setDescription("The Template App API description")
    //     .setVersion("1.0")
    //     .addTag("users")
    //     .build();
    // const document = SwaggerModule.createDocument(app, config);
    // SwaggerModule.setup("api/docs", app, document);

    // Start on port

    await app.listen(enviroments().PORT);
    // server.on("upgrade", astroProxy.upgrade);
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.log(
        `Application is running on2: http://localhost:${enviroments().PORT}`
    ); // Avoid await app.getUrl() for now
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.log(
        `Swagger Docs available at: http://localhost:${
            enviroments().PORT
        }/api/docs`
    );
}
bootstrap();
