'use strict';
const { DataType } = require('sequelize-typescript');
const schema = process.env.DEV_POSTGRES_SCHEMA || 'public';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        await queryInterface.createTable(
            { schema: schema, tableName: 'AboutUs' },
            {
                apartmentId: {
                    allowNull: false,
                    foreignKey: true,
                    primaryKey: true,
                    type: DataType.UUID,
                },
                aboutUs: {
                    type: DataType.STRING(1000),
                },
                moto: {
                    type: DataType.STRING(100),
                },
                titleImage: {
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
            }
        );
    },

    async down(queryInterface) {
        await queryInterface.dropTable({
            schema: schema,
            tableName: 'AboutUs',
        });
    },
};
