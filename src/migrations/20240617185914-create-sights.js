'use strict';
const { DataType } = require('sequelize-typescript');
const schema = process.env.DEV_POSTGRES_SCHEMA || 'public';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        const sight = await queryInterface.createTable(
            { schema: schema, tableName: 'Sights' },
            {
                sightId: {
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
                imagesUrl: {
                    type: DataType.ARRAY(DataType.STRING),
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
        sight.associates = (models) => {
            sight.belongsTo(models.Apartment, {
                foreignKey: 'apartmentId',
            });
        };
    },
    async down(queryInterface) {
        await queryInterface.dropTable({ schema: schema, tableName: 'Sights' });
    },
};
