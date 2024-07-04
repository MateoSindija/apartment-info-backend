'use strict';
const { DataType } = require('sequelize-typescript');

const schema = process.env.DEV_POSTGRES_SCHEMA || 'public';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        const shop = await queryInterface.createTable(
            { schema: schema, tableName: 'Shops' },
            {
                shopId: {
                    allowNull: false,
                    defaultValue: DataType.UUIDV4,
                    primaryKey: true,
                    type: DataType.UUID,
                },
                title: {
                    type: DataType.STRING(50),
                },
                description: {
                    type: DataType.STRING(1000),
                },
                lat: {
                    type: DataType.DOUBLE,
                },
                lng: {
                    type: DataType.DOUBLE,
                },
                imagesUrl: {
                    type: DataType.ARRAY(DataType.STRING),
                },
                apartmentId: {
                    type: DataType.STRING,
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
        shop.associates = (models) => {
            shop.belongsTo(models.Apartment, {
                foreignKey: 'apartmentId',
            });
        };
    },
    async down(queryInterface) {
        await queryInterface.dropTable('Shops');
    },
};
