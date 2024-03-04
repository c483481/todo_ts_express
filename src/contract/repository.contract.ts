import { ObjectId } from "mongoose";
import { FindResult, GetDetail_Payload, List_Payload } from "../module/dto.module";
import { TodoAttribute, TodoCreationAttribute } from "../server/model/nosql/todos.model";
import { UsersAttributes, UsersCreationAttributes } from "../server/model/sql/users.model";
import { LoginHistoryAttribute, LoginHistoryCreationAttribute } from "../server/model/nosql/login-history.model";
import { LoginHistoryCreation_Payload } from "../server/dto/login-history.dto";

export interface AppRepositoryMap {
    users: UsersRepository;
    todos: TodosRepository;
    limitEmail: EmailLimitRepository;
    loginHistory: LoginHistoryRepository;
}

export interface UsersRepository {
    findDetail(payload: GetDetail_Payload): Promise<UsersAttributes | null>;

    findByEmail(email: string): Promise<UsersAttributes | null>;

    findByXid(xid: string): Promise<UsersAttributes | null>;

    insertUsers(payload: UsersCreationAttributes): Promise<UsersAttributes>;

    getListUsers(payload: List_Payload): Promise<FindResult<UsersAttributes>>;

    updateUsers(id: number, updatedValues: Partial<UsersAttributes>, version: number): Promise<number>;

    deleteUsers(id: number): Promise<number>;

    updateBulkUsers(payload: UsersCreationAttributes[]): Promise<UsersAttributes[]>;

    findManyUsers(xid: Set<string>): Promise<UsersAttributes[]>;

    createBulkUsers(payload: UsersCreationAttributes[]): Promise<UsersAttributes[]>;
}

export interface TodosRepository {
    findByDetails(payload: GetDetail_Payload): Promise<TodoAttribute | null>;

    findTodos(payload: List_Payload): Promise<FindResult<TodoAttribute>>;

    insertTodos(payload: TodoCreationAttribute): Promise<TodoAttribute>;

    updateTodos(id: ObjectId, updateValues: Partial<TodoAttribute>, version: number): Promise<number>;

    deleteTodos(id: ObjectId): Promise<number>;
}

export interface EmailLimitRepository {
    limitEmailRequest(email: string): Promise<void>;

    getEmailRequest(email: string): Promise<number>;
}

export interface LoginHistoryRepository {
    insertLoginHistory(payload: LoginHistoryCreationAttribute): Promise<LoginHistoryAttribute>;

    findLoginHistory(payload: List_Payload): Promise<FindResult<LoginHistoryAttribute>>;

    deleteByEpoch(epoch: number): Promise<number>;

    triggerPubsub(payload: LoginHistoryCreation_Payload): void;
}
