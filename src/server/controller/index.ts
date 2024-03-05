import { Router } from "express";
import { AppServiceMap } from "../../contract/service.contract";
import { BaseController } from "./base.controller";
import { AuthController } from "./auth.controller";
import { TodosController } from "./todos.controller";
import { UsersController } from "./users.controller";
import { LoginHistoryController } from "./login-history.controller";
import { limiter } from "../../handler/limitter.handler";
import { idempotency } from "../../module/idempotency.module";

export class Controller {
    private readonly auth = new AuthController();
    private readonly todos = new TodosController();
    private readonly users = new UsersController();
    private readonly loginHistory = new LoginHistoryController();

    init(service: AppServiceMap): Router {
        const router = Router();
        Object.entries(this).forEach(([k, r]) => {
            if (r instanceof BaseController) {
                r.init(service);
                r.initRoute();
                const prefix = `/${r.getPrefix()}`;

                if (r.getUseLimiter()) {
                    router.use(prefix, limiter);
                    console.log(`initiate limiter in ${prefix}`);
                }

                if (r.getUseIdempotency()) {
                    router.use(idempotency.handler);
                    console.log(`initiate idempotency in ${prefix}`);
                }

                router.use(prefix, r.getRouter());

                console.log(`initiate ${k} route`);
            }
        });

        return router;
    }
}
