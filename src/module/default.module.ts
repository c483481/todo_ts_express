import { DataTypes } from "sequelize";
import { UserSession } from "./dto.module";

export const DEFAULT_USER_SESSION_ANONYMUS: UserSession = {
    xid: "ANONYMUS",
    email: "anonymus@anonymus.com",
    ip: "anonymus",
};

const id = {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
};

const version = {
    type: DataTypes.INTEGER,
    allowNull: false,
};

const createdAt = {
    type: DataTypes.DATE,
    allowNull: false,
};

const updatedAt = {
    type: DataTypes.DATE,
    allowNull: false,
};

const modifiedBy = {
    type: DataTypes.JSONB,
    allowNull: false,
};

const xid = {
    type: DataTypes.STRING(60),
    allowNull: false,
    unique: true,
};

export const CommonColumn = {
    id,
    version,
    createdAt,
    updatedAt,
    modifiedBy,
    xid,
};
