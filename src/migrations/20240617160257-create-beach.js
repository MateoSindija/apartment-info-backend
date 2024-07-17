'use strict';
const { DataType } = require('sequelize-typescript');
const schema = process.env.DEV_POSTGRES_SCHEMA || 'public';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        const beach = await queryInterface.createTable(
            { schema: schema, tableName: 'Beaches' },
            {
                beachId: {
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
                    type: DataType.STRING(50),
                },
                description: {
                    type: DataType.STRING(1000),
                },
                imagesUrl: {
                    type: DataType.ARRAY(DataType.STRING),
                },
                location: {
                    allowNull: false,
                    type: DataType.GEOGRAPHY('Point'),
                },
                terrainType: {
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
                deletedAt: {
                    allowNull: true,
                    type: DataType.DATE,
                },
            }
        );
        beach.associates = (models) => {
            beach.belongsTo(models.Apartment, {
                foreignKey: 'apartmentId',
            });
        };
    },
    async down(queryInterface) {
        await queryInterface.dropTable({
            schema: schema,
            tableName: 'Beaches',
        });
    },
};
