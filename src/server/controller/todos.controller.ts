import { Request } from "express";
import { AppServiceMap, TodosService } from "../../contract/service.contract";
import { BaseController } from "./base.controller";
import { getDetailOption, getForceUsersSession, getListOption } from "../../utils/helper.utils";
import { WrapAppHandler } from "../../handler/default.handler";
import { TodoCreation_Payload, TodoUpdateStatus_Payload, TodoUpdate_Payload } from "../dto/todos.dto";
import { validate } from "../validate";
import { TodosValidator } from "../validate/todos.validator";
import { defaultMiddleware } from "../../utils/middleware-helper.utils";

export class TodosController extends BaseController {
    private service!: TodosService;

    constructor() {
        super("todos");
    }

    init(service: AppServiceMap): void {
        this.service = service.todos;
    }

    initRoute(): void {
        this.router.use("/", defaultMiddleware());
        this.router.get("/", WrapAppHandler(this.getListTodo));
        this.router.get("/:xid", WrapAppHandler(this.getDetailsTodos));
        this.router.post("/", WrapAppHandler(this.postCreateTodo));
        this.router.put("/:xid", WrapAppHandler(this.putUpdateTodo));
        this.router.delete("/:xid", WrapAppHandler(this.deleteTodo));
        this.router.patch("/:xid", WrapAppHandler(this.patchStatusTodo));
    }

    getDetailsTodos = async (req: Request): Promise<unknown> => {
        const payload = getDetailOption(req);

        const result = await this.service.getDetailTodo(payload);

        return result;
    };

    getListTodo = async (req: Request): Promise<unknown> => {
        const payload = getListOption(req);

        const result = await this.service.getListTodo(payload);

        return result;
    };

    postCreateTodo = async (req: Request): Promise<unknown> => {
        const userSession = getForceUsersSession(req);

        const payload = req.body as TodoCreation_Payload;

        validate(TodosValidator.TodosCreation_Payload, payload);

        payload.userSession = userSession;

        const result = await this.service.createTodo(payload);

        return result;
    };

    putUpdateTodo = async (req: Request): Promise<unknown> => {
        const userSession = getForceUsersSession(req);

        const payload = req.body as TodoUpdate_Payload;
        payload.xid = req.params.xid;

        validate(TodosValidator.TodoUpdate_Payload, payload);

        payload.userSession = userSession;

        const result = await this.service.updateTodo(payload);

        return result;
    };

    deleteTodo = async (req: Request): Promise<unknown> => {
        const payload = getDetailOption(req);

        await this.service.deleteTodo(payload);

        return {
            status: "success",
        };
    };

    patchStatusTodo = async (req: Request): Promise<unknown> => {
        const userSession = getForceUsersSession(req);

        const payload = req.body as TodoUpdateStatus_Payload;
        payload.xid = req.params.xid;

        validate(TodosValidator.TodoUpdateStatus_Payload, payload);

        payload.userSession = userSession;
        const result = await this.service.updateStatusTodo(payload);

        return result;
    };
}
