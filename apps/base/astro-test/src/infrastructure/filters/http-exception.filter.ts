import enviroments from "@infrastructure/config/server/environments.config";
import { now } from "@infrastructure/libs";
import { astroRender } from "@infrastructure/libs/server/astro-proxy";
import {
    type ArgumentsHost,
    Catch,
    HttpException,
    HttpStatus,
} from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";
import type { Request, Response } from "express";

@Catch()
export class HttpExceptionFilter extends BaseExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();
        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;
        if (request.url.startsWith("/api")) {
            const response = ctx.getResponse<Response>();

            let result: Record<string, unknown> = {
                success: false,
                statusCode: status,
                ...(exception instanceof HttpException
                    ? exception.getResponse() instanceof Object
                        ? (exception.getResponse() as Record<string, unknown>)
                        : { message: exception.getResponse() as string }
                    : { message: "Internal server error" }),
            };

            if (enviroments().NODE_ENV === "development") {
                result = {
                    path: request.url,
                    timestamp: now(),
                    ...(result || {}),
                };
            }
            return response.status(status).json(result);
        }
        return astroRender()(request, response, () => {});
    }
}
