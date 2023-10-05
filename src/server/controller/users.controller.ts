import { Request } from "express";
import { AppServiceMap, UsersService } from "../../contract/service.contract";
import { BaseController } from "./base.controller";
import { getDetailOption, getForceUsersSession, getListOption } from "../../utils/helper.utils";
import { WrapAppHandler } from "../../handler/default.handler";
import { defaultMiddleware } from "../../utils/middleware-helper.utils";
import { CreateUsersBulk_Payload, UpdateUsersBulk_Payload } from "../dto/users.dto";
import { validate } from "../validate";
import { UsersValidator } from "../validate/users.validator";

export class UsersController extends BaseController {
    private service!: UsersService;

    constructor() {
        super("users");
    }

    init(service: AppServiceMap): void {
        this.service = service.users;
    }

    initRoute(): void {
        this.router.use(defaultMiddleware());
        this.router.get("/:xid", WrapAppHandler(this.getDetailUsers));
        this.router.get("/", WrapAppHandler(this.getListUsers));
        this.router.delete("/:xid", WrapAppHandler(this.deleteUsers));
        this.router.put("/many", WrapAppHandler(this.putUpdateManny));
        this.router.post("/many", WrapAppHandler(this.postInsertMany));
    }

    getDetailUsers = async (req: Request): Promise<unknown> => {
        const payload = getDetailOption(req);

        const result = await this.service.findDetailUsers(payload);

        return result;
    };

    getListUsers = async (req: Request): Promise<unknown> => {
        const payload = getListOption(req);

        const result = await this.service.findListUsers(payload);

        return result;
    };

    deleteUsers = async (req: Request): Promise<unknown> => {
        const payload = getDetailOption(req);

        await this.service.deleteUsers(payload);

        return {
            data: "success",
        };
    };

    putUpdateManny = async (req: Request): Promise<unknown> => {
        const userSession = getForceUsersSession(req);

        const payload = req.body as UpdateUsersBulk_Payload;

        validate(UsersValidator.UsersUpdateBulk_Payload, payload);

        payload.userSession = userSession;

        const result = await this.service.updateManyUsers(payload);

        return result;
    };

    postInsertMany = async (req: Request): Promise<unknown> => {
        const userSession = getForceUsersSession(req);

        const payload = req.body as CreateUsersBulk_Payload;

        validate(UsersValidator.UsersInsertBulk_Payload, payload);

        payload.userSession = userSession;

        const result = await this.service.insertManyUsers(payload);

        return result;
    };
}
