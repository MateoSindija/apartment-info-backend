'use strict';

const schema = process.env.DEV_POSTGRES_SCHEMA || 'public';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        await queryInterface.renameColumn(
            { schema: schema, tableName: 'Messages' },
            'creatorId',
            'apartmentId'
        );
        await queryInterface.renameColumn(
            { schema: schema, tableName: 'Messages' },
            'recipientId',
            'userId'
        );
    },

    async down() {},
};
