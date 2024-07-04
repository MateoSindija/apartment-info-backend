'use strict';
const { DataType } = require('sequelize-typescript');
const schema = process.env.DEV_POSTGRES_SCHEMA || 'public';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        const reservation = await queryInterface.createTable(
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

                userId: {
                    foreignKey: true,
                    allowNull: true,
                    type: DataType.UUID,
                },
                createdAt: {
                    allowNull: false,
                    type: DataType.DATE,
                },
                organizationId: { foreignKey: true, type: DataType.UUID },
                updatedAt: {
                    allowNull: false,
                    type: DataType.DATE,
                },
            }
        );
        reservation.associates = (models) => {
            reservation.belongsTo(models.Apartment, {
                foreignKey: 'apartmentId',
            });
            reservation.belongsTo(models.Organization, {
                foreignKey: 'organizationId',
            });
        };
    },

    async down(queryInterface) {
        await queryInterface.dropTable({
            schema: schema,
            tableName: 'Reservations',
        });
    },
};
