import { GetDetail_Payload, ListResult, List_Payload } from "../module/dto.module";
import { AuthLogin_Payload, AuthRegister_Payload, AuthResult } from "../server/dto/auth.dto";
import { LoginHistoryResult } from "../server/dto/login-history.dto";
import {
    TodoCreation_Payload,
    TodoResult,
    TodoUpdateStatus_Payload,
    TodoUpdate_Payload,
} from "../server/dto/todos.dto";
import { CreateUsersBulk_Payload, UpdateUsersBulk_Payload, UsersResult } from "../server/dto/users.dto";

export interface AppServiceMap {
    todos: TodosService;
    auth: AuthService;
    users: UsersService;
    loginHistory: LoginHistoryService;
}

export interface TodosService {
    getDetailTodo(payload: GetDetail_Payload): Promise<TodoResult>;

    getListTodo(payload: List_Payload): Promise<ListResult<TodoResult>>;

    createTodo(payload: TodoCreation_Payload): Promise<TodoResult>;

    updateTodo(payload: TodoUpdate_Payload): Promise<TodoResult>;

    deleteTodo(payload: GetDetail_Payload): Promise<void>;

    updateStatusTodo(payload: TodoUpdateStatus_Payload): Promise<TodoResult>;
}

export interface AuthService {
    login(payload: AuthLogin_Payload): Promise<AuthResult>;

    register(payload: AuthRegister_Payload): Promise<UsersResult>;

    refreshToken(token: string | null): Promise<AuthResult>;
}

export interface UsersService {
    findListUsers(payload: List_Payload): Promise<ListResult<UsersResult>>;

    findDetailUsers(payload: GetDetail_Payload): Promise<UsersResult>;

    deleteUsers(payload: GetDetail_Payload): Promise<void>;

    updateManyUsers(payload: UpdateUsersBulk_Payload): Promise<UsersResult[]>;

    insertManyUsers(payload: CreateUsersBulk_Payload): Promise<UsersResult[]>;
}

export interface LoginHistoryService {
    findList(payload: List_Payload): Promise<ListResult<LoginHistoryResult>>;
}
