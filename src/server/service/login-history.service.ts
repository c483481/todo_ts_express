import { pubsubEvent } from "../../constant/pubsub-symbole.constant";
import { AppRepositoryMap, LoginHistoryRepository } from "../../contract/repository.contract";
import { pubsubCron } from "../../module/cron.module";
import { ListResult, List_Payload } from "../../module/dto.module";
import { compose, composeResult, createData } from "../../utils/helper.utils";
import { PubSubAck, pubSub } from "../../module/pubsub.module";
import { LoginHistoryCreation_Payload, LoginHistoryResult } from "../dto/login-history.dto";
import { LoginHistoryAttribute, LoginHistoryCreationAttribute } from "../model/nosql/login-history.model";
import { BaseService } from "./base.service";
import { getEpoch30DaysAgo } from "../../utils/date.utils";

export class LoginHistory extends BaseService {
    private loginHistoryRepo!: LoginHistoryRepository;
    init(repository: AppRepositoryMap): void {
        this.loginHistoryRepo = repository.loginHistory;

        pubSub.subscribe(pubsubEvent.loginHistoryInsert, this.pubsubInsertLoginHistory);
        pubSub.subscribe(pubsubCron.deleteLoginHistory, this.pubsubDelete30Days);
    }

    findList = async (payload: List_Payload): Promise<ListResult<LoginHistoryResult>> => {
        const result = await this.loginHistoryRepo.findLoginHistory(payload);

        const items = compose<LoginHistoryAttribute, LoginHistoryResult>(result.rows, composeLoginHistory);

        return {
            items,
            count: result.count,
        };
    };

    private pubsubInsertLoginHistory = async (payload: LoginHistoryCreation_Payload): Promise<PubSubAck> => {
        try {
            const { userXid, ip } = payload;

            const createdValues = createData<LoginHistoryCreationAttribute>({
                userXid,
                ip,
            });

            await this.loginHistoryRepo.insertLoginHistory(createdValues);

            return PubSubAck.ACK;
        } catch (error) {
            return PubSubAck.Retry;
        }
    };

    private pubsubDelete30Days = async (_payload: unknown): Promise<PubSubAck> => {
        const oneMonthAgoEpoch = getEpoch30DaysAgo();

        const count = await this.loginHistoryRepo.deleteByEpoch(oneMonthAgoEpoch);

        console.log(`deleted ${count} of device data`);

        return PubSubAck.ACK;
    };
}

export function composeLoginHistory(row: LoginHistoryAttribute): LoginHistoryResult {
    return composeResult<LoginHistoryAttribute, LoginHistoryResult>(row, {
        ip: row.ip,
    });
}
