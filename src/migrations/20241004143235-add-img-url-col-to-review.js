'use strict';

const { DataType } = require('sequelize-typescript');
const schema = process.env.DEV_POSTGRES_SCHEMA || 'public';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        await queryInterface.addColumn(
            { schema: schema, tableName: 'Reviews' },
            'imagesUrl',
            { type: DataType.ARRAY(DataType.STRING), allowNull: true }
        );
    },

    async down(queryInterface) {
        await queryInterface.removeColumn(
            { schema: schema, tableName: 'Reviews' },
            'imagesUrl'
        );
    },
};
