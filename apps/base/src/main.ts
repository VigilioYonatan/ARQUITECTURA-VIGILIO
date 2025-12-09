import enviroments from "@infrastructure/config/server/environments.config";
import { astroProxy } from "@infrastructure/libs/server/astro-proxy";
import { NestFactory } from "@nestjs/core";
import helmet from "helmet";
import { Logger } from "nestjs-pino";
import { AppModule } from "./app.module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { bufferLogs: true });
    app.useLogger(app.get(Logger));
    // app.setGlobalPrefix("api");
    // Security Headers
    app.use(helmet());

    // Global Pipes
    // app.useGlobalPipes(new ValidationPipe());

    // Enable CORS
    app.enableCors();

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
    const server = await app.listen(enviroments().PORT);
    server.on("upgrade", astroProxy.upgrade);
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.log(`Application is running on2: ${await app.getUrl()}`);
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.log(`Swagger Docs available at: ${await app.getUrl()}/api/docs`);
}
bootstrap();
