'use strict';

const schema = process.env.DEV_POSTGRES_SCHEMA || 'public';
const { DataType } = require('sequelize-typescript');

/** @type {import('sequelize-cli').Migration} */

module.exports = {
    async up(queryInterface) {
        const organizations = await queryInterface.createTable(
            { schema: schema, tableName: 'Organizations' },
            {
                organizationId: {
                    allowNull: false,
                    primaryKey: true,
                    type: DataType.UUID,
                    defaultValue: DataType.UUIDV4,
                },
                name: {
                    type: DataType.STRING,
                },
                ownerId: {
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
        organizations.associates = (models) => {
            organizations.belongsTo(models.User, { foreignKey: 'OwnerId' });
        };
    },
    async down(queryInterface) {
        await queryInterface.dropTable({
            schema: schema,
            tableName: 'Organizations',
        });
    },
};
