import { attachMiddleware } from "@vigilio/express-core";
import {
    ObjectEntriesAsync,
    ObjectSchemaAsync,
    safeParse,
} from "@vigilio/valibot";
import { Request, Response, NextFunction } from "express";

export function Validator<T extends ObjectEntriesAsync>(
    schema:
        | ObjectSchemaAsync<T>
        | ((req: Request, res: Response) => ObjectSchemaAsync<T>)
) {
    return (
        target: unknown,
        propertyKey: string,
        _descriptor: PropertyDescriptor
    ) => {
        attachMiddleware(
            target,
            propertyKey,
            async (req: Request, res: Response, next: NextFunction) => {
                const schemaConverter =
                    typeof schema === "function" ? schema(req, res) : schema;
                const data = await safeParse(schemaConverter, req.body);
                if (!data.success) {
                    let message: string | null = null;
                    try {
                        message = Array.isArray(
                            JSON.parse(data.issues[0].message)
                        )
                            ? // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                              (req as any).t(
                                  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                                  ...JSON.parse((data as any).issues[0].message)
                              )
                            : // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                              (data as any).issues[0].message;
                    } catch (error) {
                        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                        message = (data as any).issues[0].message;
                    }
                    return res.status(400).json({
                        success: false,
                        message,
                        body: data.issues[0].path
                            ? data.issues[0].path[0].key
                            : data.issues[0].validation,
                    });
                }
                req.body = data.output;
                next();
            }
        );
    };
}

export function Pipe<T extends ObjectEntriesAsync>(
    schema:
        | ObjectSchemaAsync<T>
        | ((req: Request, res: Response) => ObjectSchemaAsync<T>)
) {
    return (
        target: unknown,
        propertyKey: string,
        _descriptor: PropertyDescriptor
    ) => {
        attachMiddleware(
            target,
            propertyKey,
            async (req: Request, res: Response, next: NextFunction) => {
                const schemaConverter =
                    typeof schema === "function" ? schema(req, res) : schema;
                const data = await safeParse(schemaConverter, req.params);

                if (!data.success) {
                    let message: string | null = null;
                    try {
                        message = Array.isArray(
                            JSON.parse(data.issues[0].message)
                        )
                            ? // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                              (req as any).t(
                                  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                                  ...JSON.parse((data as any).issues[0].message)
                              )
                            : // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                              (data as any).issues[0].message;
                    } catch (error) {
                        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                        message = (data as any).issues[0].message;
                    }

                    return res.status(400).json({
                        success: false,
                        message,
                        body: data.issues[0].path
                            ? data.issues[0].path[0].key
                            : data.issues[0].validation,
                    });
                }
                req.params = data.output;
                next();
            }
        );
    };
}
