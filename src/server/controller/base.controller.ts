import { Router } from "express";
import { AppServiceMap } from "../../contract/service.contract";

export abstract class BaseController {
    protected router: Router;
    private readonly prefix: string;
    private readonly useLimiter: boolean;
    private readonly useIdempotency: boolean;

    constructor(
        prefix: string,
        { useLimiter, useIdempotency }: { useLimiter: boolean; useIdempotency: boolean } = {
            useIdempotency: true,
            useLimiter: true,
        }
    ) {
        this.prefix = prefix;
        this.router = Router();
        this.useLimiter = useLimiter;
        this.useIdempotency = useIdempotency;
    }

    abstract init(service: AppServiceMap): void;

    abstract initRoute(): void;

    getPrefix = (): string => {
        return this.prefix;
    };

    getRouter = (): Router => {
        return this.router;
    };

    getUseIdempotency = (): boolean => {
        return this.useIdempotency;
    };

    getUseLimiter = (): boolean => {
        return this.useLimiter;
    };
}
