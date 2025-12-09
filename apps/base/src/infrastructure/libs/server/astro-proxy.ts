import path from "node:path";
import enviroments from "@infrastructure/config/server/environments.config";
import type { NextFunction, Request, Response } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

export const astroProxy = createProxyMiddleware({
    target: `http://localhost:${enviroments().VITE_PORT}`, // Tu Astro dev server
    changeOrigin: true,
    ws: true, // Importante: WebSockets activados
    selfHandleResponse: false,
});

export function astroRender(props: Record<string, unknown> = {}) {
    return async (req: Request, res: Response, next: NextFunction) => {
        console.log({ portssssssssssssssss: enviroments().VITE_PORT });

        try {
            console.log(
                "Proxy - Setting x-astro-locals:",
                JSON.stringify(props)
            );
            req.headers["x-astro-locals"] = JSON.stringify(props);
            return astroProxy(req, res, next);
        } catch (error) {
            const entryPath = path.join(process.cwd(), "dist/server/entry.mjs");
            const { handler: astroHandler } = await import(entryPath);
            // Delegate to Astro
            await astroHandler(req, res, next);
        }
    };
}
