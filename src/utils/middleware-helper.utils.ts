import { NextFunction, Request, RequestHandler, Response } from "express";
import { compareString } from "./compare.utils";
import { getIp, saveUsersSession } from "./helper.utils";
import { jwtModule } from "../module/jwt.module";
import { EncodeToken, UserSession } from "../module/dto.module";
import { ERROR_FORBIDDEN, ERROR_UNAUTHORIZE } from "../handler/message.handler";

export function getValidToken(token: unknown): string | null {
    if (typeof token !== "string") {
        return null;
    }

    const [type, validToken] = token.split(" ");

    if (!compareString(type, "Bearer") || !validToken) {
        return null;
    }

    return validToken;
}

export function defaultMiddleware(audiance?: string[]): RequestHandler {
    return (req: Request, _res: Response, next: NextFunction): void | Response => {
        const accessToken = req.headers.authorization;

        if (!accessToken) {
            next(ERROR_UNAUTHORIZE);
            return;
        }

        const token = getValidToken(accessToken);
        if (!token) {
            next(ERROR_UNAUTHORIZE);
            return;
        }

        try {
            let verification!: EncodeToken;
            if (audiance) {
                verification = jwtModule.verifyWithAudience(token, audiance);
            } else {
                verification = jwtModule.verify(token);
            }
            delete req.headers.authorization;

            const userSession = verification.data as UserSession;

            userSession.ip = getIp(req);

            saveUsersSession(req, userSession);
            next();
        } catch (error) {
            next(ERROR_FORBIDDEN);
        }
    };
}

export function middlewareRBAC(audiance?: string[]): RequestHandler {
    return (req: Request, _res: Response, next: NextFunction): void | Response => {
        const accessToken = req.headers.authorization;

        if (!accessToken) {
            next();
            return;
        }

        const [type, token] = accessToken.split(" ");

        if (!compareString(type, "Bearer") || !token) {
            next();
            return;
        }

        try {
            let verification!: EncodeToken;
            if (audiance) {
                verification = jwtModule.verifyWithAudience(token, audiance);
            } else {
                verification = jwtModule.verify(token);
            }
            delete req.headers.authorization;

            const userSession = verification.data as UserSession;

            userSession.ip = getIp(req);

            saveUsersSession(req, userSession);
            next();
            return;
        } catch (error) {
            next();
            return;
        }
    };
}
