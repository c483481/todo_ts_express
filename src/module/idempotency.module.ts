import { NextFunction, Request, Response } from "express";

export interface Storage {
    has: (str: string) => boolean;
    add: (str: string) => void;
    delete: (str: string) => void;
}

export interface IdempotencyConfig {
    header: string;
    len: number;
    storage: Storage;
    second: number;
}

class Idempotency {
    private readonly header: string;
    private len = 10;
    private storage: Storage = new Set<string>();
    private lifeTime: number = 30 * 1000;

    constructor(header = "X-Idempotency-Key") {
        this.header = header;
    }

    setLength = (len: number): void => {
        this.len = len;
    };

    setLifeTime = (second: number): void => {
        this.lifeTime = second * 1000;
    };

    setStorage = (storage: Storage): void => {
        this.storage = storage;
    };

    handler = (req: Request, res: Response, next: NextFunction): void | Response => {
        const method = req.method;
        if (this.isMethodSafe(method)) {
            return next();
        }

        const key = req.header(this.header);

        if (!key) {
            return res.status(400).json({
                success: false,
                code: "E_IDEM_0",
                message: `Header ${this.header} Not Found`,
            });
        }

        if (key.length != this.len) {
            return res.status(400).json({
                success: false,
                code: "E_IDEM_1",
                message: `Invalid Length Key (${key.length}) != (${this.len})`,
            });
        }

        if (this.storage.has(key)) {
            return res.status(409).json({
                success: false,
                code: "E_IDEM_2",
                message: `Key ${key} Already Exist`,
            });
        }

        this.addToStorage(key);

        return next();
    };

    private addToStorage = (key: string): void => {
        this.storage.add(key);

        setTimeout(() => {
            this.storage.delete(key);
        }, this.lifeTime);
    };

    private isMethodSafe = (method: string): boolean => {
        switch (method) {
            case "GET":
            case "HEAD":
            case "OPTIONS":
            case "TRACE":
                return true;
            default:
                return false;
        }
    };
}

export const idempotency = new Idempotency();
