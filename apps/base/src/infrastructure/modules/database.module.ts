import { PrismaService } from "@infrastructure/services/prisma.service";
import { Global, Module } from "@nestjs/common";
import { AppConfigModule } from "./config.module";

@Global()
@Module({
    imports: [AppConfigModule],
    providers: [PrismaService],
    exports: [PrismaService],
})
export class DatabaseModule {}
