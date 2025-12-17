import { Module } from "@nestjs/common";
import { AppConfigModule } from "../../modules/config.module";
import { RustFSService } from "./rustfs.service";

@Module({
    imports: [AppConfigModule],
    providers: [RustFSService],
    exports: [RustFSService],
})
export class RustFSModule {}
