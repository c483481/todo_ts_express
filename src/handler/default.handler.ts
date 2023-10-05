import { NextFunction, Request, RequestHandler, Response } from "express";
import { ErrorResponse } from "./responses.handler";
import { DEFAULT_INTERNAL_ERROR } from "./message.handler";

export interface AppManifest {
    appName: string;
    appVersion: string;
}

export function WrapAppHandler(handler: (req: Request) => Promise<unknown> | unknown): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const result = await handler(req);
            return res.status(200).json({
                success: true,
                message: "OK",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };
}

export function WrapMiddlewareHandler(handler: (req: Request) => Promise<void> | void): RequestHandler {
    return async (req: Request, _res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            await handler(req);
            next();
        } catch (error) {
            next(error);
        }
    };
}

export function WrapMiddlewareAudianceHandler(
    audiance: string[],
    handler: (req: Request, audiance: string[]) => Promise<void> | void
): RequestHandler {
    return async (req: Request, _res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            await handler(req, audiance);
            next();
        } catch (error) {
            next(error);
        }
    };
}

export function handleNotFound(req: Request, res: Response, _next: NextFunction): Response | void {
    if (!res.headersSent) {
        return res.status(404).json({
            success: false,
            code: "Not Found",
            message: `Not Found path ${req.originalUrl}`,
        });
    }
}

export function handleRequest(req: Request, res: Response, next: NextFunction): void {
    const start = performance.now();
    const { method, originalUrl } = req;
    res.on("finish", () => {
        const { statusCode } = res;
        const end = performance.now();
        console.log(`${method} ${originalUrl} ${statusCode} ${Math.round(end - start)}ms`);
    });
    next();
}

export function handleError(err: Error, _req: Request, res: Response, _next: NextFunction): Response {
    if (err instanceof ErrorResponse) {
        const response = err.getError();
        return res.status(response.status).json({
            success: response.success,
            code: response.code,
            message: response.message,
            data: response.data,
        });
    }

    return res.status(DEFAULT_INTERNAL_ERROR.status).json({
        success: DEFAULT_INTERNAL_ERROR.success,
        code: DEFAULT_INTERNAL_ERROR.code,
        message: DEFAULT_INTERNAL_ERROR.message,
    });
}

export function handleApiStatus(manifest: AppManifest): RequestHandler {
    return (_req: Request, res: Response): Response => {
        return res.status(200).json({
            success: true,
            message: "OK",
            data: {
                appName: manifest.appName,
                version: manifest.appVersion,
            },
        });
    };
}
