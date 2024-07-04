'use strict';
const { DataType } = require('sequelize-typescript');
const schema = process.env.DEV_POSTGRES_SCHEMA || 'public';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        const scrapingLink = await queryInterface.createTable(
            {
                schema: schema,
                tableName: 'ScrapingLinks',
            },
            {
                scrapingId: {
                    allowNull: false,
                    primaryKey: true,
                    defaultValue: DataType.UUIDV4,
                    type: DataType.UUID,
                },
                apartmentId: {
                    foreignKey: true,
                    type: DataType.UUID,
                },
                url: {
                    type: DataType.STRING,
                },
                siteType: {
                    type: DataType.STRING,
                },
                organizationId: {
                    foreignKey: true,
                    type: DataType.UUID,
                },
            }
        );

        scrapingLink.associates = (models) => {
            scrapingLink.belongsTo(models.Apartment, {
                foreignKey: 'apartmentId',
            });
            scrapingLink.belongsTo(models.Organization, {
                foreignKey: 'organizationId',
            });
        };
    },

    async down(queryInterface) {
        await queryInterface.dropTable({
            schema: schema,
            tableName: 'ScrapingLinks',
        });
    },
};
