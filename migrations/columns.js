const { DataTypes } = require("sequelize");
const { Constants } = require("./constants");

const Columns = {};

const id = {
    type: DataTypes.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
};

const createdAt = {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Constants.DEFAULT_TIMESTAMP,
};

const updatedAt = {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Constants.DEFAULT_TIMESTAMP,
};

const version = {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: Constants.DEFAULT_VERSION,
};

const xid = {
    type: DataTypes.STRING(60),
    allowNull: false,
    unique: true,
}

const modifiedBy = {
    type: DataTypes.JSONB,
    allowNull: false,
}

Columns.CommonColumn = {
    id,
    createdAt,
    updatedAt,
    version,
    xid,
    modifiedBy,
};

module.exports = Columns;
