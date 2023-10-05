import { FilterQuery, SortOrder } from "mongoose";
import { AppDataSource } from "../../module/datasource.module";
import { FindResult, List_Payload } from "../../module/dto.module";
import { LoginHistory, LoginHistoryAttribute, LoginHistoryCreationAttribute } from "../model/nosql/login-history.model";
import { BaseRepository } from "./base.repository";
import { LoginHistoryRepository } from "../../contract/repository.contract";
import { LoginHistoryCreation_Payload } from "../dto/login-history.dto";
import { pubSub } from "../../module/pubsub.module";
import { pubsubEvent } from "../../constant/pubsub-symbole.constant";

export class MongooseLoginHistoryRepository extends BaseRepository implements LoginHistoryRepository {
    private loginHistory!: typeof LoginHistory;
    init(datasource: AppDataSource): void {
        this.loginHistory = datasource.noSqlModel.LoginHistory;
    }

    insertLoginHistory = async (payload: LoginHistoryCreationAttribute): Promise<LoginHistoryAttribute> => {
        return await new this.loginHistory(payload).save();
    };

    findLoginHistory = async (payload: List_Payload): Promise<FindResult<LoginHistoryAttribute>> => {
        const { sortBy, usersSession, showAll, limit, skip } = payload;
        const { field, sort } = this.parseSortBy(sortBy);

        const where: FilterQuery<LoginHistoryAttribute> = { userXid: usersSession.xid };

        const todos = this.loginHistory.find(where).sort({ [field]: sort });

        if (!showAll) {
            todos.limit(limit).skip(skip);
        }

        const [rows, count] = await Promise.all([todos.exec(), this.loginHistory.countDocuments(where)]);

        return {
            rows,
            count,
        };
    };

    deleteByEpoch = async (epoch: number): Promise<number> => {
        const dateToDeleteBefore = new Date(epoch * 1000);

        const where: FilterQuery<LoginHistoryAttribute> = {
            createdAt: { $lt: dateToDeleteBefore },
        };

        const deleted = await this.loginHistory.deleteMany(where);

        return deleted.deletedCount;
    };

    triggerPubsub = (payload: LoginHistoryCreation_Payload): void => {
        pubSub.publish(pubsubEvent.loginHistoryInsert, payload, { maxRetry: 10 });
    };

    parseSortBy = (sortBy: string): { field: Partial<keyof LoginHistoryAttribute>; sort: SortOrder } => {
        // determine sorting option
        let field!: Partial<keyof LoginHistoryAttribute>;
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
