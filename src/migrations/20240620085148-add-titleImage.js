'use strict';

const { DataType } = require('sequelize-typescript');
const schema = process.env.DEV_POSTGRES_SCHEMA || 'public';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        await queryInterface.addColumn(
            { schema: schema, tableName: 'Beaches' },
            'titleImage',
            { type: DataType.STRING }
        );

        await queryInterface.addColumn(
            { schema: schema, tableName: 'Sights' },
            'titleImage',
            { type: DataType.STRING }
        );

        await queryInterface.addColumn(
            { schema: schema, tableName: 'Restaurants' },
            'titleImage',
            { type: DataType.STRING }
        );

        await queryInterface.addColumn(
            { schema: schema, tableName: 'Shops' },
            'titleImage',
            { type: DataType.STRING }
        );

        await queryInterface.addColumn(
            { schema: schema, tableName: 'Devices' },
            'titleImage',
            { type: DataType.STRING }
        );
    },

    async down(queryInterface) {
        await queryInterface.removeColumn(
            { schema: schema, tableName: 'Beaches' },
            'titleImage'
        );

        await queryInterface.removeColumn(
            { schema: schema, tableName: 'Sights' },
            'titleImage'
        );

        await queryInterface.removeColumn(
            { schema: schema, tableName: 'Restaurants' },
            'titleImage'
        );

        await queryInterface.removeColumn(
            { schema: schema, tableName: 'Shops' },
            'titleImage'
        );

        await queryInterface.removeColumn(
            { schema: schema, tableName: 'Devices' },
            'titleImage'
        );
    },
};
