'use strict';
const schema = process.env.DEV_POSTGRES_SCHEMA || 'public';
const { DataType } = require('sequelize-typescript');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        await queryInterface.createTable(
            { schema: schema, tableName: 'Apartments' },
            {
                apartmentId: {
                    allowNull: false,
                    primaryKey: true,
                    defaultValue: DataType.UUIDV4,
                    type: DataType.UUID,
                },
                ownerId: {
                    foreignKey: true,
                    type: DataType.UUID,
                },
                name: {
                    type: DataType.STRING,
                },
                address: {
                    type: DataType.STRING,
                },
                location: {
                    allowNull: false,
                    type: DataType.GEOGRAPHY('Point'),
                },
                createdAt: {
                    allowNull: false,
                    type: DataType.DATE,
                },
                updatedAt: {
                    allowNull: false,
                    type: DataType.DATE,
                },
                deletedAt: {
                    allowNull: true,
                    type: DataType.DATE,
                },
            }
        );
    },
    async down(queryInterface) {
        await queryInterface.dropTable({
            schema: schema,
            tableName: 'Apartments',
        });
    },
};
