'use strict';
const { DataType } = require('sequelize-typescript');
const schema = process.env.DEV_POSTGRES_SCHEMA || 'public';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        const restaurant = await queryInterface.createTable(
            { schema: schema, tableName: 'Restaurants' },
            {
                restaurantId: {
                    allowNull: false,
                    defaultValue: DataType.UUIDV4,
                    primaryKey: true,
                    type: DataType.UUID,
                },
                ownerId: {
                    foreignKey: true,
                    type: DataType.UUID,
                },
                title: {
                    type: DataType.STRING,
                },
                description: {
                    type: DataType.STRING,
                },
                lat: {
                    type: DataType.DOUBLE,
                },
                lng: {
                    type: DataType.DOUBLE,
                },
                review: {
                    type: DataType.DOUBLE,
                },
                reviewAmount: {
                    type: DataType.INTEGER,
                },
                emailContact: {
                    type: DataType.STRING,
                },
                phoneContact: {
                    type: DataType.STRING,
                },
                imagesUrl: {
                    type: DataType.ARRAY(DataType.STRING),
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
        restaurant.associates = (models) => {
            restaurant.belongsTo(models.Apartment, {
                foreignKey: 'apartmentId',
            });
        };
    },
    async down(queryInterface) {
        await queryInterface.dropTable({
            schema: schema,
            tableName: 'Restaurants',
        });
    },
};
