import { Sequelize } from "sequelize";
import { Users } from "./users.model";

export interface AppSqlModel {
    Users: typeof Users;
}

export function initSqlModels(sequelize: Sequelize): AppSqlModel {
    Users.initModels(sequelize);
    return {
        Users,
    };
}
