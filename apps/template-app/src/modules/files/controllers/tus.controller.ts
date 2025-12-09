import {
    Controller,
    Post,
    Patch,
    Head,
    Options,
    Req,
    Res,
    Get,
} from "@nestjs/common";
import { Request, Response } from "express";
import { TusService } from "../services/tus.service";

@Controller("files/resumable")
export class TusController {
    constructor(private readonly tusService: TusService) {}

    @Post()
    async createUpload(@Req() req: Request, @Res() res: Response) {
        return this.tusService.server.handle(req, res);
    }

    @Patch(":id")
    async uploadChunk(@Req() req: Request, @Res() res: Response) {
        return this.tusService.server.handle(req, res);
    }

    @Head(":id")
    async getUploadStatus(@Req() req: Request, @Res() res: Response) {
        return this.tusService.server.handle(req, res);
    }

    @Options()
    async getOptions(@Req() req: Request, @Res() res: Response) {
        return this.tusService.server.handle(req, res);
    }

    // Tus requires GET for some clients to check existence, though not strictly in protocol for creation
    @Get(":id")
    async getUpload(@Req() req: Request, @Res() res: Response) {
        return this.tusService.server.handle(req, res);
    }
}
