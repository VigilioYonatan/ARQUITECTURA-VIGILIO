/// <reference types="express" />
import { UserAuth } from "@/user/schemas/user.schema";

declare global {
    namespace Express {
        interface Request {
            user: UserAuth;
        }
    }
}
