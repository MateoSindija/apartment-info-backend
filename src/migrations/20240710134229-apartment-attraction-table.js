'use strict';
const { DataType } = require('sequelize-typescript');
const schema = process.env.DEV_POSTGRES_SCHEMA || 'public';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        await queryInterface.createTable(
            {
                schema: schema,
                tableName: 'DeviceApartment',
            },
            {
                apartmentId: {
                    foreignKey: true,
                    type: DataType.UUID,
                },
                deviceId: {
                    foreignKey: true,
                    type: DataType.UUID,
                },
            }
        );
        await queryInterface.createTable(
            {
                schema: schema,
                tableName: 'ShopApartment',
            },
            {
                apartmentId: {
                    foreignKey: true,
                    type: DataType.UUID,
                },
                shopId: {
                    foreignKey: true,
                    type: DataType.UUID,
                },
            }
        );
        await queryInterface.createTable(
            {
                schema: schema,
                tableName: 'RestaurantApartment',
            },
            {
                apartmentId: {
                    foreignKey: true,
                    type: DataType.UUID,
                },
                restaurantId: {
                    foreignKey: true,
                    type: DataType.UUID,
                },
            }
        );
        await queryInterface.createTable(
            {
                schema: schema,
                tableName: 'BeachApartment',
            },
            {
                apartmentId: {
                    foreignKey: true,
                    type: DataType.UUID,
                },
                beachId: {
                    foreignKey: true,
                    type: DataType.UUID,
                },
            }
        );
        await queryInterface.createTable(
            {
                schema: schema,
                tableName: 'SightApartment',
            },
            {
                apartmentId: {
                    foreignKey: true,
                    type: DataType.UUID,
                },
                sightId: {
                    foreignKey: true,
                    type: DataType.UUID,
                },
            }
        );
    },

    async down(queryInterface) {
        await queryInterface.dropTable({
            schema: schema,
            tableName: 'DeviceApartment',
        });
        await queryInterface.dropTable({
            schema: schema,
            tableName: 'ShopApartment',
        });
        await queryInterface.dropTable({
            schema: schema,
            tableName: 'RestaurantApartment',
        });
        await queryInterface.dropTable({
            schema: schema,
            tableName: 'BeachApartment',
        });
        await queryInterface.dropTable({
            schema: schema,
            tableName: 'SightApartment',
        });
    },
};
