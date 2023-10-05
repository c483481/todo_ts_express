import { Router } from "express";
import { AppServiceMap } from "../../contract/service.contract";

export abstract class BaseController {
    protected router: Router;
    private readonly prefix: string;
    private readonly useLimiter: boolean;

    constructor(prefix: string, useLimiter = true) {
        this.prefix = prefix;
        this.router = Router();
        this.useLimiter = useLimiter;
    }

    abstract init(service: AppServiceMap): void;

    abstract initRoute(): void;

    getPrefix = (): string => {
        return this.prefix;
    };

    getRouter = (): Router => {
        return this.router;
    };

    getUseLimiter = (): boolean => {
        return this.useLimiter;
    };
}
