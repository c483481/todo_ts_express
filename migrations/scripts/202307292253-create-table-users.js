"use strict";

const { CommonColumn } = require("../columns");
const { id, version, createdAt, updatedAt,  xid, modifiedBy } = CommonColumn;
const name = "users"
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable(name, {
            id,
            version,
            createdAt,
            updatedAt,
            xid,
            modifiedBy,
            username: {
                type: Sequelize.STRING(255),
                allowNull: false,
            },
            email:{
                type: Sequelize.STRING(255),
                allowNull: false,
                unique: true
            },
            password: {
                type: Sequelize.STRING(255),
                allowNull: false
            },
        });
    },

    async down(queryInterface, _Sequelize) {
        await queryInterface.dropTable(name);
    },
};
