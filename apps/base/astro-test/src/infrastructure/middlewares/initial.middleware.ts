import { DRIZZLE } from "@infrastructure/providers/database/database.module";
import { schema } from "@infrastructure/providers/database/database.schema";
import { Inject, Injectable, type NestMiddleware } from "@nestjs/common";
import { eq } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import type { NextFunction, Request, Response } from "express";

@Injectable()
export class InitialCacheMiddleware implements NestMiddleware {
    constructor(
        @Inject(DRIZZLE) private readonly db: NodePgDatabase<typeof schema>
    ) {}

    async use(req: Request, _res: Response, next: NextFunction) {
        const empresa = await this.db.query.empresa.findFirst({
            where: eq(schema.empresa.id, 1),
        });
        console.log("empresa", empresa);

        req.locals = {
            user: {
                id: 1,
                name: "Vigilio Services",
            },
            empresa: {
                id: 1,
                name_empresa: "Yonatan Vigilio",
            } as any,
        };

        next();
    }
}
