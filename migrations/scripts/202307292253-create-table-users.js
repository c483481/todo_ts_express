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

        await queryInterface.addIndex(name, ['email'], {
            name: 'email_index',
            unique: true,
        });

        await queryInterface.addIndex(name, ["email"], {
            name: "xid_index",
            unique: true,
        });

        await queryInterface.addIndex(name, ["xid"]);
    },

    async down(queryInterface, _Sequelize) {
        await queryInterface.removeIndex(name, "email_index");
        await queryInterface.removeIndex(name, "xid_index");
        await queryInterface.dropTable(name);
    },
};
