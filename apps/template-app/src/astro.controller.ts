import { Controller, Get, Req, Res, Next } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { handler as astroHandler } from "../../astro-app/dist/server/entry.mjs";

@Controller()
export class AstroController {
    @Get("*")
    async renderAstro(
        @Req() req: Request,
        @Res() res: Response,
        @Next() next: NextFunction
    ) {
        // Check if the request is for an API route (should be handled by NestJS)
        if (req.path.startsWith("/api")) {
            return next();
        }

        // Delegate to Astro
        await astroHandler(req, res, next);
    }
}
