import {
    All,
    Controller,
    Get,
    Next,
    Req,
    Res,
    VERSION_NEUTRAL,
} from "@nestjs/common";
import type { NextFunction, Request, Response } from "express";
import { astroRender } from "../../infrastructure/libs/server/astro-proxy";
import { WebPath } from "./web.routers";
import { WebService } from "./web.service";

@Controller({ path: "/", version: VERSION_NEUTRAL })
export class WebController {
    constructor(private readonly webService: WebService) {}

    @Get(WebPath.INDEX)
    async index(
        @Req() req: Request,
        @Res() res: Response,
        @Next() next: NextFunction
    ) {
        const result = this.webService.index();
        return await astroRender(result)(req, res, next);
    }

    @Get(WebPath.CONTACT)
    async contact(
        @Req() req: Request,
        @Res() res: Response,
        @Next() next: NextFunction
    ) {
        return await astroRender()(req, res, next);
    }

    @Get(WebPath.NOT_FOUND)
    async notFound(
        @Req() req: Request,
        @Res() res: Response,
        @Next() next: NextFunction
    ) {
        return await astroRender()(req, res, next);
    }

    @All("*")
    async catchAll(
        @Req() req: Request,
        @Res() res: Response,
        @Next() next: NextFunction
    ) {
        if (req.originalUrl.startsWith("/api")) {
            return next();
        }
        // Para assets (/_astro/..., /favicon.ico), solo dejamos pasar
        return await astroRender()(req, res, next);
    }

    @Get(WebPath.DASHBOARD)
    async dashboard(
        @Req() req: Request,
        @Res() res: Response,
        @Next() next: NextFunction
    ) {
        return await astroRender()(req, res, next);
    }
}
