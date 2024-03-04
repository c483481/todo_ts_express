import {
    AppRepositoryMap,
    EmailLimitRepository,
    LoginHistoryRepository,
    TodosRepository,
    UsersRepository,
} from "../../contract/repository.contract";
import { AppDataSource } from "../../module/datasource.module";
import { BaseRepository } from "./base.repository";
import { RedisEmailRepository } from "./email-redis.repository";
import { MongooseLoginHistoryRepository } from "./login-history.repository";
import { MongooseTodosRepository } from "./todos.repository";
import { SequelizeUsersRepository } from "./users.repository";

export class Repository implements AppRepositoryMap {
    readonly users: UsersRepository = new SequelizeUsersRepository();
    readonly todos: TodosRepository = new MongooseTodosRepository();
    readonly limitEmail: EmailLimitRepository = new RedisEmailRepository();
    readonly loginHistory: LoginHistoryRepository = new MongooseLoginHistoryRepository();

    init(datasource: AppDataSource) {
        Object.entries(this).forEach(([k, r]) => {
            if (r instanceof BaseRepository) {
                r.init(datasource);
                console.log(`initiate repository ${k}`);
            }
        });
    }
}
