'use strict';
const { DataType } = require('sequelize-typescript');
const schema = process.env.DEV_POSTGRES_SCHEMA || 'public';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        await queryInterface.addColumn(
            { schema: schema, tableName: 'Beaches' },
            'organizationId',
            { foreignKey: true, type: DataType.UUID }
        );

        await queryInterface.addColumn(
            { schema: schema, tableName: 'Sights' },
            'organizationId',
            { foreignKey: true, type: DataType.UUID }
        );

        await queryInterface.addColumn(
            { schema: schema, tableName: 'Restaurants' },
            'organizationId',
            { foreignKey: true, type: DataType.UUID }
        );

        await queryInterface.addColumn(
            { schema: schema, tableName: 'Shops' },
            'organizationId',
            { foreignKey: true, type: DataType.UUID }
        );

        await queryInterface.addColumn(
            { schema: schema, tableName: 'Devices' },
            'organizationId',
            { foreignKey: true, type: DataType.UUID }
        );
    },

    async down(queryInterface) {
        await queryInterface.removeColumn(
            { schema: schema, tableName: 'Beaches' },
            'organizationId'
        );

        await queryInterface.removeColumn(
            { schema: schema, tableName: 'Sights' },
            'organizationId'
        );

        await queryInterface.removeColumn(
            { schema: schema, tableName: 'Restaurants' },
            'organizationId'
        );

        await queryInterface.removeColumn(
            { schema: schema, tableName: 'Shops' },
            'organizationId'
        );

        await queryInterface.removeColumn(
            { schema: schema, tableName: 'Devices' },
            'organizationId'
        );
    },
};
