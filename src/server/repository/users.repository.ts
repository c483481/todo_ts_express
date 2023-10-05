import { UsersRepository } from "../../contract/repository.contract";
import { AppDataSource } from "../../module/datasource.module";
import { FindResult, GetDetail_Payload, List_Payload } from "../../module/dto.module";
import { Users, UsersAttributes, UsersCreationAttributes } from "../model/sql/users.model";
import { BaseRepository } from "./base.repository";
import { Op, Order, WhereOptions } from "sequelize";

export class SequelizeUsersRepository extends BaseRepository implements UsersRepository {
    private users!: typeof Users;
    init(datasource: AppDataSource): void {
        this.users = datasource.sqlModel.Users;
    }

    findDetail = async (payload: GetDetail_Payload): Promise<UsersAttributes | null> => {
        return await this.users.findOne({
            where: {
                xid: payload.xid,
                email: payload.usersSession.email,
            },
        });
    };

    findByEmail = async (email: string): Promise<UsersAttributes | null> => {
        return await this.users.findOne({
            where: {
                email: email,
            },
        });
    };

    findByXid = async (xid: string): Promise<UsersAttributes | null> => {
        return await this.users.findOne({
            where: {
                xid: xid,
            },
        });
    };

    insertUsers = async (payload: UsersCreationAttributes): Promise<UsersAttributes> => {
        return await this.users.create(payload);
    };

    getListUsers = async (payload: List_Payload): Promise<FindResult<UsersAttributes>> => {
        // retrieve options filters
        const { filters, showAll } = payload;

        // prepare find options
        let limit: number | undefined = undefined;
        let offset: number | undefined = undefined;

        if (!showAll) {
            limit = payload.limit;
            offset = payload.skip;
        }

        const where: WhereOptions<UsersAttributes> = {};

        if (filters.username) {
            where.username = filters.username;
        }

        // parsing sort option
        const { order } = this.parseSortBy(payload.sortBy);

        return await this.users.findAndCountAll({
            where,
            offset,
            limit,
            order,
        });
    };

    updateUsers = async (id: number, updatedValues: Partial<UsersAttributes>, version: number): Promise<number> => {
        const result = await this.users.update(updatedValues, { where: { id, version } });

        return result[0];
    };

    deleteUsers = async (id: number): Promise<number> => {
        return await this.users.destroy({ where: { id } });
    };

    updateBulkUsers = async (payload: UsersCreationAttributes[]): Promise<UsersAttributes[]> => {
        return await this.users.bulkCreate(payload, {
            fields: ["id", "xid", "email", "password", "username", "modifiedBy", "version", "updatedAt", "createdAt"],
            updateOnDuplicate: ["username", "version", "updatedAt", "modifiedBy"],
        });
    };

    createBulkUsers = async (payload: UsersCreationAttributes[]): Promise<UsersAttributes[]> => {
        return await this.users.bulkCreate(payload, {
            ignoreDuplicates: true,
        });
    };

    findManyUsers = async (xid: Set<string>): Promise<UsersAttributes[]> => {
        return await this.users.findAll({
            where: {
                xid: {
                    [Op.in]: [...xid],
                },
            },
            limit: xid.size,
        });
    };

    parseSortBy = (sortBy: string): { order: Order } => {
        // determine sorting option
        let order: Order;
        switch (sortBy) {
            case "createdAt-asc": {
                order = [["createdAt", "ASC"]];
                break;
            }
            case "createdAt-desc": {
                order = [["createdAt", "DESC"]];
                break;
            }
            case "updatedAt-asc": {
                order = [["updatedAt", "ASC"]];
                break;
            }
            case "updatedAt-desc": {
                order = [["updatedAt", "DESC"]];
                break;
            }
            default: {
                order = [["createdAt", "DESC"]];
                sortBy = "createdAt-desc";
            }
        }

        return { order };
    };
}
