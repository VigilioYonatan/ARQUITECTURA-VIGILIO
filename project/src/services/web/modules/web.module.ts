import { Module } from "@nestjs/common";
import { WebController } from "../controllers/web.controller";
import { WebService } from "../services/web.service";

@Module({
    controllers: [WebController],
    providers: [WebService],
})
export class WebModule {}
