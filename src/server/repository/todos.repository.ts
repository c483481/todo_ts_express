import { FilterQuery, ObjectId, SortOrder } from "mongoose";
import { TodosRepository } from "../../contract/repository.contract";
import { AppDataSource } from "../../module/datasource.module";
import { FindResult, GetDetail_Payload, List_Payload } from "../../module/dto.module";
import { Todo, TodoAttribute, TodoCreationAttribute } from "../model/nosql/todos.model";
import { BaseRepository } from "./base.repository";

export class MongooseTodosRepository extends BaseRepository implements TodosRepository {
    private todos!: typeof Todo;
    init(datasource: AppDataSource): void {
        this.todos = datasource.noSqlModel.Todo;
    }

    findByDetails = async (payload: GetDetail_Payload): Promise<TodoAttribute | null> => {
        return await this.todos.findOne({
            xid: payload.xid,
            userXid: payload.usersSession.xid,
        });
    };

    findTodos = async (payload: List_Payload): Promise<FindResult<TodoAttribute>> => {
        const { field, sort } = this.parseSortBy(payload.sortBy);
        const { filters } = payload;

        const where: FilterQuery<TodoAttribute> = { userXid: payload.usersSession.xid };

        if (filters.title) {
            where.title = {
                $regex: filters.title,
                $options: "i",
            };
        }

        const todos = this.todos.find(where).sort({ [field]: sort });

        if (!payload.showAll) {
            todos.limit(payload.limit).skip(payload.skip);
        }

        const [rows, count] = await Promise.all([todos.exec(), this.todos.countDocuments(where)]);

        return {
            rows,
            count,
        };
    };

    insertTodos = async (payload: TodoCreationAttribute): Promise<TodoAttribute> => {
        return await new this.todos(payload).save();
    };

    updateTodos = async (id: ObjectId, updateValues: Partial<TodoAttribute>, version: number): Promise<number> => {
        const updated = await this.todos.updateMany(
            {
                _id: id,
                version: version,
            },
            updateValues
        );
        return updated.modifiedCount;
    };

    deleteTodos = async (id: ObjectId): Promise<number> => {
        const deleted = await this.todos.deleteMany({
            _id: id,
        });

        return deleted.deletedCount;
    };

    parseSortBy = (sortBy: string): { field: Partial<keyof TodoAttribute>; sort: SortOrder } => {
        // determine sorting option
        let field!: Partial<keyof TodoAttribute>;
        let sort!: SortOrder;
        switch (sortBy) {
            case "createdAt-asc": {
                field = "createdAt";
                sort = "asc";
                break;
            }
            case "createdAt-desc": {
                field = "createdAt";
                sort = "desc";
                break;
            }
            case "updatedAt-asc": {
                field = "updatedAt";
                sort = "asc";
                break;
            }
            case "updatedAt-desc": {
                field = "updatedAt";
                sort = "desc";
                break;
            }
            default: {
                field = "createdAt";
                sort = "desc";
                break;
            }
        }

        return { field, sort };
    };
}
