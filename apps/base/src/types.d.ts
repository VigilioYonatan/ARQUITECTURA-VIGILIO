declare module "*/entry.mjs" {
    import { Request, Response, NextFunction } from "express";
    export const handler: (
        req: Request,
        res: Response,
        next: NextFunction
    ) => Promise<void>;
}
