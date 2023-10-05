import { Dialect, Sequelize } from "sequelize";
import { AppSqlModel, initSqlModels } from "../server/model/sql";
import { AppNoSqlModel, initNoSqlModels } from "../server/model/nosql";
import { AppConfiguration } from "../config";
import mongoose from "mongoose";
import { createClient, RedisClientType } from "redis";

export interface AppDataSource {
    sql: Sequelize;
    sqlModel: AppSqlModel;
    noSqlModel: AppNoSqlModel;
    redis: RedisClientType;
}

class DataSources {
    async init(config: AppConfiguration): Promise<AppDataSource> {
        const { sql, sqlModel } = await this.initSequelize(config);
        const noSqlModel = await this.initMongosee(config);
        const redis = await this.initRedis(config);

        return {
            sql,
            sqlModel,
            noSqlModel,
            redis,
        };
    }

    private initSequelize = async (config: AppConfiguration): Promise<{ sql: Sequelize; sqlModel: AppSqlModel }> => {
        const conn = new Sequelize({
            dialect: getDialect(config.dbDialect),
            host: config.dbHost,
            port: config.dbPort,
            username: config.dbUser,
            password: config.dbPass,
            database: config.dbName,
            logging: !config.isProduction,
        });

        const sqlModel = initSqlModels(conn);

        try {
            await conn.sync();
            console.log(`All models in Sequelize were synchronized successfully in database : ${config.dbName}.`);
        } catch (error) {
            console.error("An error occurred while synchronizing the models:", error);
            throw new Error("Failed to connect to sql");
        }

        return {
            sql: conn,
            sqlModel: sqlModel,
        };
    };

    private initMongosee = async (config: AppConfiguration): Promise<AppNoSqlModel> => {
        try {
            await mongoose.connect(config.mongoseeUri, {
                auth: {
                    username: config.mongoseeUsername || undefined,
                    password: config.mongoseePassword || undefined,
                },
                authSource: config.mongooseeAuthSource || "admin",
            });
            console.log(`Success to connect : ${config.mongoseeUri}`);
        } catch (error) {
            console.error("An error connect to mongodb :", error);
            throw new Error(`Failed to connect to no sql with uri : ${config.mongoseeUri}`);
        }

        const noSqlModel = initNoSqlModels();

        return noSqlModel;
    };

    private initRedis = async (config: AppConfiguration): Promise<RedisClientType> => {
        const redisClient: RedisClientType = createClient({
            url: config.redisUri,
            password: config.redisPassword || undefined,
        });

        redisClient.on("error", (error) => {
            console.error("An error connect to redis :", error);
            throw new Error(`Failed to connect to redis with uri : ${config.redisUri}`);
        });

        redisClient.on("ready", () => {
            console.log(`Success to connect : ${config.redisUri}`);
        });

        await redisClient.connect();
        return redisClient;
    };
}

function getDialect(str: string): Dialect {
    switch (str) {
        case "mysql":
        case "postgres":
        case "sqlite":
        case "mariadb":
        case "mssql":
        case "db2":
        case "snowflake":
        case "oracle":
            return str;
        default:
            return "postgres";
    }
}

export const datasource = new DataSources();
