'use strict';
const {DataType} = require('sequelize-typescript');
const schema = process.env.DEV_POSTGRES_SCHEMA || 'public';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        await queryInterface.changeColumn(
            {schema: schema, tableName: 'Reviews'},
            'review',
            DataType.STRING(1000)
        );
    },

    async down() {
    }
};
