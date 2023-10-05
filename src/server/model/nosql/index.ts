import { LoginHistory } from "./login-history.model";
import { Todo } from "./todos.model";

export interface AppNoSqlModel {
    Todo: typeof Todo;
    LoginHistory: typeof LoginHistory;
}

export function initNoSqlModels(): AppNoSqlModel {
    return {
        Todo,
        LoginHistory,
    };
}
