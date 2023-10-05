import { AppRepositoryMap, UsersRepository } from "../../contract/repository.contract";
import { UsersService } from "../../contract/service.contract";
import { GetDetail_Payload, ListResult, List_Payload } from "../../module/dto.module";
import { compose, composeResult, createData, updateData } from "../../utils/helper.utils";
import { errorResponses } from "../../response";
import { CreateUsersBulk_Payload, UpdateUsersBulk_Payload, UpdateUsers_Payload, UsersResult } from "../dto/users.dto";
import { UsersAttributes, UsersCreationAttributes } from "../model/sql/users.model";
import { BaseService } from "./base.service";
import { bcryptModule } from "../../module/bcrypt.module";

export class Users extends BaseService implements UsersService {
    private userRepo!: UsersRepository;
    init(repository: AppRepositoryMap): void {
        this.userRepo = repository.users;
    }

    findListUsers = async (payload: List_Payload): Promise<ListResult<UsersResult>> => {
        const users = await this.userRepo.getListUsers(payload);

        const items = compose<UsersAttributes, UsersResult>(users.rows, composeUsers);

        return {
            items,
            count: users.count,
        };
    };

    findDetailUsers = async (payload: GetDetail_Payload): Promise<UsersResult> => {
        const users = await this.findUsers(payload);

        return composeUsers(users);
    };

    deleteUsers = async (payload: GetDetail_Payload): Promise<void> => {
        const users = await this.findUsers(payload);

        const count = await this.userRepo.deleteUsers(users.id);

        if (!count) {
            throw errorResponses.getError("E_FOUND_1");
        }

        console.log(`deleted ${count} of users`);
    };

    updateManyUsers = async (payload: UpdateUsersBulk_Payload): Promise<UsersResult[]> => {
        const { arr, userSession } = payload;

        const setXid: Set<string> = new Set<string>();

        arr.map((item: UpdateUsers_Payload) => {
            setXid.add(item.xid);
        });

        const usersArr = await this.userRepo.findManyUsers(setXid);

        setXid.clear();

        const mapusers = usersArr.reduce((acc: Map<string, UsersAttributes>, item: UsersAttributes) => {
            acc.set(item.xid, item);
            return acc;
        }, new Map<string, UsersAttributes>());

        const arrUpdate: UsersCreationAttributes[] = arr.reduce(
            (acc: UsersCreationAttributes[], item: UpdateUsers_Payload) => {
                if (setXid.has(item.xid)) {
                    return acc;
                }

                const value = mapusers.get(item.xid);
                setXid.add(item.xid);
                if (!value) {
                    return acc;
                }

                const updatedValues = updateData<UsersAttributes>(
                    value,
                    {
                        username: item.username,
                    },
                    userSession
                );

                Object.assign(value, updatedValues);

                acc.push(this.toComposeUsers(value));

                return acc;
            },
            []
        );

        setXid.clear();

        mapusers.clear();

        try {
            const result = await this.userRepo.updateBulkUsers(arrUpdate);

            arrUpdate.length = 0;

            const items = compose<UsersAttributes, UsersResult>(result, composeUsers);

            return items;
        } catch (error) {
            if (!(error instanceof Error) || error.name !== "SequelizeDatabaseError") {
                throw errorResponses.getError("E_INRNL_1");
            }

            throw errorResponses.getError("E_REC_1");
        }
    };

    insertManyUsers = async (payload: CreateUsersBulk_Payload): Promise<UsersResult[]> => {
        const { arr, userSession } = payload;

        const setEmail = new Set();

        const arrCreationAttribute: UsersCreationAttributes[] = [];

        for (const item of arr) {
            if (setEmail.has(item.email)) {
                continue;
            }

            setEmail.add(item.email);

            const newPassword: string = await bcryptModule.hash(item.password);

            const createdValues = createData<UsersCreationAttributes>(
                {
                    username: item.username,
                    password: newPassword,
                    email: item.email,
                },
                userSession
            );

            arrCreationAttribute.push(createdValues);
        }

        const result = await this.userRepo.createBulkUsers(arrCreationAttribute);

        arrCreationAttribute.length = 0;

        const items = compose<UsersAttributes, UsersResult>(result, composeUsers);

        return items;
    };

    private findUsers = async (payload: GetDetail_Payload): Promise<UsersAttributes> => {
        const users = await this.userRepo.findDetail(payload);

        if (!users) {
            throw errorResponses.getError("E_FOUND_1");
        }

        return users;
    };

    private toComposeUsers(row: UsersAttributes): UsersCreationAttributes {
        return {
            id: row.id,
            xid: row.xid,
            username: row.username,
            password: row.password,
            email: row.email,
            version: row.version,
            modifiedBy: row.modifiedBy,
            updatedAt: row.updatedAt,
            createdAt: row.createdAt,
        };
    }
}

export function composeUsers(row: UsersAttributes): UsersResult {
    return composeResult<UsersAttributes, UsersResult>(row, {
        username: row.username,
        email: row.email,
    });
}
