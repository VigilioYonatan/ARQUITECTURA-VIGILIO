import {
    type ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import type { Request, Response } from "express";

@Injectable()
export class HybridAuthGuard extends AuthGuard("jwt") {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const response = context.switchToHttp().getResponse<Response>();

        // 1. Check Session (Passport Session)
        // isAuthenticated() is checking req.user presence usually set by session
        if (request.isAuthenticated()) {
            return true;
        }

        // 2. Try JWT via AuthGuard('jwt')
        try {
            // Calling super.canActivate triggers the strategy logic
            // If it succeeds, it sets req.user (overwriting session user if any, but we checked)
            // If it returns true, we are good.
            const result = (await super.canActivate(context)) as boolean;
            return result;
        } catch (_e) {
            // If JWT fails or throws Unauthorized, we handle strict response protocol
            return this.handleCustomResponse(request, response);
        }
    }

    // Override handleRequest from AuthGuard to prevent default throwing if we want custom protocol
    // biome-ignore lint/suspicious/noExplicitAny: library override
    handleRequest(err: any, user: any, _info: any, _context: ExecutionContext) {
        if (err || !user) {
            throw err || new UnauthorizedException();
        }
        return user;
    }

    private handleCustomResponse(
        request: Request,
        response: Response
    ): boolean {
        // Determine context: API vs Web
        // If request path starts with /api (excluding web routes maybe?)
        // The user snippet uses a boolean flag "isApi". We can infer it.
        const isApi =
            request.path.startsWith("/api") ||
            request.headers.accept?.includes("application/json") ||
            request.headers["content-type"]?.includes("application/json");

        if (isApi) {
            // NestJS convention: Throw exception, let Global Filter handle JSON response
            // But user specifically asked for JSON response structure similar to snippet
            // We can throw UnauthorizedException and let standard NestJS exception filter handle 401
            throw new UnauthorizedException({
                success: false,
                message: "Unauthorized",
            });
        }

        // For Web: Redirect
        response.redirect("/auth/login");
        // We return false to stop the guard chain, but since we redirected, execution technically ends/responses
        // returning false in canActivate usually throws 403 Forbidden default if not handled.
        // But since we manipulated response, we should return false?
        // Actually, preventing further execution is key.
        return false;
    }
}
