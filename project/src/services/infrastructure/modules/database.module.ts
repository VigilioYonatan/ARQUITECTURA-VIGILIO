import { Module } from "@nestjs/common";
import { AppConfigModule } from "../modules/config.module";
import { DatabaseProvider } from "../providers/database.provider";

@Module({
    imports: [AppConfigModule],
    providers: [DatabaseProvider],
    exports: [DatabaseProvider],
})
export class DatabaseModule {}
