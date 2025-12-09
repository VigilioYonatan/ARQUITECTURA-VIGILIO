import { All, Controller, Get, Next, Req, Res } from "@nestjs/common";
import type { NextFunction, Request, Response } from "express";
import { Logger } from "nestjs-pino";
import { astroRender } from "../../infrastructure/libs/server/astro-proxy";
import { WebService } from "./web.service";

@Controller("/")
export class WebController {
    constructor(
        private readonly webService: WebService,
        private readonly logger: Logger
    ) {}

    @Get("/")
    index(
        @Req() req: Request,
        @Res() res: Response,
        @Next() next: NextFunction
    ) {
        const result = this.webService.index();
        this.logger.log(result);
        return astroRender(result)(req, res, next);
    }

    @All("*")
    catchAll(
        @Req() req: Request,
        @Res() res: Response,
        @Next() next: NextFunction
    ) {
        // Para assets (/_astro/..., /favicon.ico), solo dejamos pasar
        return astroRender()(req, res, next);
    }
}
