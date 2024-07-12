'use strict';
const { DataType } = require('sequelize-typescript');
const schema = process.env.DEV_POSTGRES_SCHEMA || 'public';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        await queryInterface.createTable(
            {
                schema: schema,
                tableName: 'Reservations',
            },
            {
                reservationId: {
                    allowNull: false,
                    primaryKey: true,
                    defaultValue: DataType.UUIDV4,
                    type: DataType.UUID,
                },
                startDate: {
                    type: DataType.DATE,
                },
                endDate: {
                    type: DataType.DATE,
                },
                apartmentId: {
                    foreignKey: true,
                    type: DataType.UUID,
                },
                createdAt: {
                    allowNull: false,
                    type: DataType.DATE,
                },
                updatedAt: {
                    allowNull: false,
                    type: DataType.DATE,
                },
            }
        );
    },

    async down(queryInterface) {
        await queryInterface.dropTable({
            schema: schema,
            tableName: 'Reservations',
        });
    },
};
