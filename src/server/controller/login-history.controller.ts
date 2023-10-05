import { Request } from "express";
import { AppServiceMap, LoginHistoryService } from "../../contract/service.contract";
import { BaseController } from "./base.controller";
import { getListOption } from "../../utils/helper.utils";
import { defaultMiddleware } from "../../utils/middleware-helper.utils";
import { WrapAppHandler } from "../../handler/default.handler";

export class LoginHistoryController extends BaseController {
    private service!: LoginHistoryService;

    constructor() {
        super("login-history");
    }

    init(service: AppServiceMap): void {
        this.service = service.loginHistory;
    }

    initRoute(): void {
        this.router.use(defaultMiddleware());
        this.router.get("/", WrapAppHandler(this.getListHistory));
    }

    getListHistory = async (req: Request): Promise<unknown> => {
        const payload = getListOption(req);

        const result = await this.service.findList(payload);

        return result;
    };
}
