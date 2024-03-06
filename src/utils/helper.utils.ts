import { Request } from "express";
import {
    BaseAttribute,
    BaseResult,
    GetDetail_Payload,
    List_Payload,
    ModifiedBy,
    UserSession,
} from "../module/dto.module";
import { parseToNumber, parseToString } from "./parse.uttils";
import { compareString } from "./compare.utils";
import { DEFAULT_USER_SESSION_ANONYMUS } from "../module/default.module";
import { toUnixEpoch } from "./date.utils";
import { ulid } from "ulidx";
import { ERROR_UNAUTHORIZE } from "../handler/responses.handler";

export function saveUsersSession(req: Request, data: UserSession): void {
    req.app.locals.users = data;
}

export function getUsersSession(req: Request): UserSession | undefined {
    return req.app.locals.users;
}

export function getForceUsersSession(req: Request): UserSession {
    const userSession: UserSession | undefined = req.app.locals.users;
    if (!userSession) {
        throw ERROR_UNAUTHORIZE;
    }
    return userSession;
}

export function saveRefreshToken(req: Request, data: { xid: string }): void {
    req.app.locals.refreshToken = data;
}

export function getForceRefreshToken(req: Request): string {
    const refreshToken: { xid: string } | undefined = req.app.locals.refreshToken;
    if (!refreshToken) {
        throw ERROR_UNAUTHORIZE;
    }
    return refreshToken.xid;
}

export function getIp(req: Request): string {
    const ip =
        req.headers["cf-connecting-ip"] ||
        req.headers["x-real-ip"] ||
        req.headers["x-forwarded-for"] ||
        req.socket.remoteAddress ||
        "";
    if (typeof ip === "string") {
        return ip;
    }
    return ip[0];
}

export function getListOption(req: Request): List_Payload {
    return {
        limit: parseToNumber(req.query.limit, 10),
        skip: parseToNumber(req.query.skip),
        sortBy: parseToString(req.query.sortBy),
        showAll: compareString(parseToString(req.query.showAll), "true"),
        filters: (req.query.filters as Record<string, string>) || {},
        usersSession: getUsersSession(req) || DEFAULT_USER_SESSION_ANONYMUS,
    };
}

export function getDetailOption(req: Request): GetDetail_Payload {
    return {
        xid: req.params.xid,
        usersSession: getUsersSession(req) || DEFAULT_USER_SESSION_ANONYMUS,
    };
}

function getModifiedBy(data: UserSession): ModifiedBy {
    return {
        xid: data.xid,
        email: data.email,
    };
}

export function compose<T, K>(arr: T[], fn: (attr: T) => K): K[] {
    const items = arr.reduce((acc: K[], item: T) => {
        const newItem = fn(item);
        acc.push(newItem);
        return acc;
    }, []);

    arr.length = 0;

    return items;
}

export function createData<T extends BaseAttribute>(o: Omit<T, keyof BaseAttribute>, userSession?: UserSession): T {
    const timestamp = new Date();
    const xid = ulid();

    return Object.assign(
        {
            xid: xid,
            version: 1,
            createdAt: timestamp,
            updatedAt: timestamp,
            modifiedBy: getModifiedBy(userSession || DEFAULT_USER_SESSION_ANONYMUS),
        } as T,
        o
    );
}

export function updateData<T extends BaseAttribute>(
    currentValues: T,
    updatedValues: Partial<Omit<T, keyof BaseAttribute>>,
    userSession?: UserSession
): Partial<T> {
    return Object.assign(updatedValues, {
        modifiedBy: getModifiedBy(userSession || DEFAULT_USER_SESSION_ANONYMUS),
        updatedAt: new Date(),
        version: currentValues.version + 1,
    } as T);
}

export function composeResult<K extends BaseAttribute, T extends BaseResult>(k: K, t: Omit<T, keyof BaseResult>): T {
    return Object.assign(t, {
        xid: k.xid,
        version: k.version,
        modifiedBy: k.modifiedBy,
        updatedAt: toUnixEpoch(k.updatedAt),
        createdAt: toUnixEpoch(k.createdAt),
    } as BaseResult) as T;
}
