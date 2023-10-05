import { RedisClientType } from "redis";
import { BaseRepository } from "./base.repository";
import { AppDataSource } from "../../module/datasource.module";
import { RefreshTokenRepository } from "../../contract/repository.contract";

export class RedisRefreshTokenRepository extends BaseRepository implements RefreshTokenRepository {
    private redis!: RedisClientType;
    private readonly prefix = "token-";
    private readonly expirationTime = 24 * 60 * 60;

    init(datasource: AppDataSource): void {
        this.redis = datasource.redis;
    }

    setRefreshToken = async (token: string, xid: string): Promise<number> => {
        const key = this.prefix + token;
        try {
            await this.redis.setEx(key, this.expirationTime, xid);
        } catch (error) {
            console.log(error);
        }
        return this.expirationTime;
    };

    getRefreshToken = async (
        token: string
    ): Promise<{
        xid: string | null;
        lifeTime: number;
    }> => {
        const key = this.prefix + token;
        const [value, ttl] = await Promise.all([this.redis.get(key), this.redis.ttl(key)]);

        return {
            xid: value || null,
            lifeTime: ttl >= 0 ? ttl : 0,
        };
    };
}
