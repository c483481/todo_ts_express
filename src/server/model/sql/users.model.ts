import { CommonColumn } from "../../../module/default.module";
import { ModifiedBy } from "../../../module/dto.module";
import { Optional, Model, Sequelize, DataTypes } from "sequelize";
import { BaseSequelizeAttribute, optionalSequelize } from "./common.model";

const { id, xid, version, modifiedBy, updatedAt, createdAt } = CommonColumn;

export interface UsersAttributes extends BaseSequelizeAttribute {
    email: string;
    username: string;
    password: string;
}

export type UsersCreationAttributes = Optional<UsersAttributes, optionalSequelize>;

export class Users extends Model<UsersAttributes, UsersCreationAttributes> implements UsersAttributes {
    xid!: string;
    updatedAt!: Date;
    createdAt!: Date;
    modifiedBy!: ModifiedBy;
    version!: number;
    id!: number;

    email!: string;
    username!: string;
    password!: string;

    static initModels(sequelize: Sequelize): typeof Users {
        return Users.init(
            {
                id,
                xid,
                version,
                modifiedBy,
                updatedAt,
                createdAt,
                email: {
                    type: DataTypes.STRING(255),
                    allowNull: false,
                    unique: true,
                },
                username: {
                    type: DataTypes.STRING(255),
                    allowNull: false,
                },
                password: {
                    type: DataTypes.STRING(255),
                    allowNull: false,
                },
            },
            {
                sequelize,
                tableName: "users",
                timestamps: false,
            }
        );
    }
}
