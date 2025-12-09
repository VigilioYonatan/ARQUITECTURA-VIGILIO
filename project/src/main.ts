import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { Logger } from "nestjs-pino";
import enviroments, {
    validateEnvironments,
} from "./config/server/environments.config";
import { AppModule } from "./services/app.module";

async function bootstrap() {
    console.log("Bootstraping app");
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        bufferLogs: true,
    });
    // app.use(client({ file: "pages/main.tsx" }));

    app.useLogger(app.get(Logger));
    await app.listen(enviroments().PORT);
    console.log(`Corriendo en puerto ${enviroments().PORT}`);
}
// validateEnvironments();
bootstrap();
