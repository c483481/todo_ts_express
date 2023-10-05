import { RedisClientType } from "redis";
import { AppDataSource } from "../../module/datasource.module";
import { BaseRepository } from "./base.repository";
import { EmailLimitRepository } from "../../contract/repository.contract";
import { parseToNumber } from "../../utils/parse.uttils";

export class RedisEmailRepository extends BaseRepository implements EmailLimitRepository {
    private redis!: RedisClientType;
    private readonly prefix = "email-";
    private readonly expired: number = 15 * 60;

    init(datasource: AppDataSource): void {
        this.redis = datasource.redis;
    }

    limitEmailRequest = async (email: string): Promise<void> => {
        const key = this.prefix + email;
        try {
            await Promise.all([this.redis.incr(key), this.redis.expire(key, this.expired)]);
        } catch (error) {
            console.error("Error occurred in RedisEmailRepository:", error);
            throw error;
        }
    };

    getEmailRequest = async (email: string): Promise<number> => {
        const result = await this.redis.get(this.prefix + email);
        return parseToNumber(result, 0);
    };
}
