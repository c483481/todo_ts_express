import { Request } from "express";
import { AppServiceMap, AuthService } from "../../contract/service.contract";
import { BaseController } from "./base.controller";
import { AuthLogin_Payload, AuthRegister_Payload } from "../dto/auth.dto";
import { validate } from "../validate";
import { AuthValidator } from "../validate/auth.validator";
import { WrapAppHandler } from "../../handler/default.handler";
import { getIp } from "../../utils/helper.utils";
import { getValidToken } from "../../utils/middleware-helper.utils";
import { limiterGetRefreshToken } from "../../handler/limitter.handler";

export class AuthController extends BaseController {
    private service!: AuthService;
    constructor() {
        super("auth");
    }

    init(service: AppServiceMap): void {
        this.service = service.auth;
    }

    initRoute(): void {
        this.router.post("/login", WrapAppHandler(this.login));
        this.router.post("/register", WrapAppHandler(this.register));
        this.router.get("/", limiterGetRefreshToken, WrapAppHandler(this.refreshToken));
    }

    login = async (req: Request): Promise<unknown> => {
        const payload = req.body as AuthLogin_Payload;

        validate(AuthValidator.AuthLogin_Payload, payload);

        payload.ip = getIp(req);

        const result = await this.service.login(payload);

        return result;
    };

    register = async (req: Request): Promise<unknown> => {
        const payload = req.body as AuthRegister_Payload;

        validate(AuthValidator.AuthRegister_Payload, payload);

        const result = await this.service.register(payload);

        return result;
    };

    refreshToken = async (req: Request): Promise<unknown> => {
        const token = getValidToken(req.headers.authorization);

        const result = await this.service.refreshToken(token);

        return result;
    };
}
