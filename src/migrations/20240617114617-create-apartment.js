'use strict';
const schema = process.env.DEV_POSTGRES_SCHEMA || 'public';
const { DataType } = require('sequelize-typescript');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        const apartment = await queryInterface.createTable(
            { schema: schema, tableName: 'Apartments' },
            {
                apartmentId: {
                    allowNull: false,
                    primaryKey: true,
                    defaultValue: DataType.UUIDV4,
                    type: DataType.UUID,
                },
                organizationId: {
                    foreignKey: true,
                    type: DataType.UUID,
                },
                name: {
                    type: DataType.STRING,
                },
                address: {
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

        apartment.associates = (models) => {
            apartment.belongsTo(models.Organization, {
                foreignKey: 'organizationId',
            });
        };
    },
    async down(queryInterface) {
        await queryInterface.dropTable('Apartments');
    },
};
