'use strict';

const { DataType } = require('sequelize-typescript');
const schema = process.env.DEV_POSTGRES_SCHEMA || 'public';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        await queryInterface.addColumn(
            { schema: schema, tableName: 'Apartments' },
            'lat',
            { type: DataType.DOUBLE }
        );
        await queryInterface.addColumn(
            { schema: schema, tableName: 'Apartments' },
            'lng',
            { type: DataType.DOUBLE }
        );
    },

    async down(queryInterface) {
        await queryInterface.removeColumn(
            { schema: schema, tableName: 'Apartments' },
            'lat'
        );

        await queryInterface.removeColumn(
            { schema: schema, tableName: 'Apartments' },
            'lng'
        );
    },
};
