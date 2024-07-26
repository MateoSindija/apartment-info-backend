'use strict';
const { DataType } = require('sequelize-typescript');
const schema = process.env.DEV_POSTGRES_SCHEMA || 'public';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        await queryInterface.addColumn(
            { schema: schema, tableName: 'Messages' },
            'senderId',
            { type: DataType.UUID, allowNull: false }
        );
    },
    async down(queryInterface) {
        await queryInterface.removeColumn(
            { schema: schema, tableName: 'Messages' },
            'senderId'
        );
    },
};
