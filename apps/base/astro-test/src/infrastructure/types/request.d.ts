/// <reference types="express" />

import type { EmpresaSchemaFromServer } from "@modules/empresa/schemas/empresa.schema";
import type { UserAuth } from "@modules/user/schemas/user.schema";
export interface Global {
    empresa: EmpresaSchemaFromServer;
    user: UserAuth;
}
declare global {
    namespace Express {
        interface Request {
            locals: Global & {
                props?: Record<string, unknown>;
            };
        }
    }
}
