import { AppRepositoryMap, TodosRepository } from "../../contract/repository.contract";
import { TodosService } from "../../contract/service.contract";
import { GetDetail_Payload, ListResult, List_Payload } from "../../module/dto.module";
import { compose, composeResult, createData, updateData } from "../../utils/helper.utils";
import { errorResponses } from "../../response";
import { TodoCreation_Payload, TodoResult, TodoUpdateStatus_Payload, TodoUpdate_Payload } from "../dto/todos.dto";
import { TodoAttribute, TodoCreationAttribute } from "../model/nosql/todos.model";
import { BaseService } from "./base.service";

export class Todos extends BaseService implements TodosService {
    private todoRepo!: TodosRepository;
    init(repository: AppRepositoryMap): void {
        this.todoRepo = repository.todos;
    }

    getDetailTodo = async (payload: GetDetail_Payload): Promise<TodoResult> => {
        const todo = await this.findTodoAttribute(payload);

        return composeTodo(todo);
    };

    getListTodo = async (payload: List_Payload): Promise<ListResult<TodoResult>> => {
        const todos = await this.todoRepo.findTodos(payload);

        const items = compose<TodoAttribute, TodoResult>(todos.rows, composeTodo);

        return {
            items,
            count: todos.count,
        };
    };

    createTodo = async (payload: TodoCreation_Payload): Promise<TodoResult> => {
        const { title, description, userSession } = payload;

        const createdValues: TodoCreationAttribute = createData<TodoCreationAttribute>(
            {
                title,
                description,
                active: true,
                userXid: userSession.xid,
            },
            userSession
        );

        const result = await this.todoRepo.insertTodos(createdValues);

        return composeTodo(result);
    };

    updateTodo = async (payload: TodoUpdate_Payload): Promise<TodoResult> => {
        const { xid, title, description, version, userSession } = payload;
        const todo = await this.findTodoAttribute({
            xid,
            usersSession: userSession,
        });

        const updateValues: Partial<TodoAttribute> = updateData<TodoAttribute>(
            todo,
            {
                title: title,
                description: description,
            },
            userSession
        );

        const count: number = await this.todoRepo.updateTodos(todo._id, updateValues, version);

        if (!count) {
            throw errorResponses.getError("E_REQ_2");
        }

        Object.assign(todo, updateValues);

        return composeTodo(todo);
    };

    deleteTodo = async (payload: GetDetail_Payload): Promise<void> => {
        const todo = await this.findTodoAttribute(payload);

        const count: number = await this.todoRepo.deleteTodos(todo._id);

        if (!count) {
            throw errorResponses.getError("E_FOUND_1");
        }

        console.log(`deleted ${count} of todos`);
    };

    updateStatusTodo = async (payload: TodoUpdateStatus_Payload): Promise<TodoResult> => {
        const { xid, status, version, userSession } = payload;

        const todo = await this.findTodoAttribute({
            xid,
            usersSession: userSession,
        });

        const updateValues = updateData<TodoAttribute>(
            todo,
            {
                active: status,
            },
            userSession
        );

        const count: number = await this.todoRepo.updateTodos(todo._id, updateValues, version);

        if (!count) {
            throw errorResponses.getError("E_REQ_2");
        }

        Object.assign(todo, updateValues);

        return composeTodo(todo);
    };

    private findTodoAttribute = async (payload: GetDetail_Payload): Promise<TodoAttribute> => {
        const todo = await this.todoRepo.findByDetails(payload);

        if (!todo) {
            throw errorResponses.getError("E_FOUND_1");
        }

        return todo;
    };
}

export function composeTodo(row: TodoAttribute): TodoResult {
    return composeResult<TodoAttribute, TodoResult>(row, {
        title: row.title,
        userXid: row.userXid,
        description: row.description,
        active: row.active,
    });
}
