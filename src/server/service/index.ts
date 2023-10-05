import { AppRepositoryMap } from "../../contract/repository.contract";
import {
    AppServiceMap,
    AuthService,
    LoginHistoryService,
    TodosService,
    UsersService,
} from "../../contract/service.contract";
import { Auth } from "./auth.service";
import { BaseService } from "./base.service";
import { LoginHistory } from "./login-history.service";
import { Todos } from "./todos.service";
import { Users } from "./users.service";

export class Service implements AppServiceMap {
    readonly todos: TodosService = new Todos();
    readonly auth: AuthService = new Auth();
    readonly users: UsersService = new Users();
    readonly loginHistory: LoginHistoryService = new LoginHistory();

    init(repository: AppRepositoryMap) {
        Object.entries(this).forEach(([k, r]) => {
            if (r instanceof BaseService) {
                r.init(repository);
                console.log(`initiate service ${k}`);
            }
        });
    }
}
