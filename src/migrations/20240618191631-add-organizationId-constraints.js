'use strict';
const schema = process.env.DEV_POSTGRES_SCHEMA || 'public';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        await queryInterface.addConstraint(
            { schema: schema, tableName: 'Beaches' },
            {
                fields: ['organizationId'],
                type: 'foreign key',
                name: 'beachesOrganizationIdForeignKey',
                references: {
                    table: {
                        tableName: 'Organizations',
                        schema: schema,
                    },
                    field: 'organizationId',
                },
            }
        );

        await queryInterface.addConstraint(
            { schema: schema, tableName: 'Sights' },
            {
                fields: ['organizationId'],
                type: 'foreign key',
                name: 'sightsOrganizationIdForeignKey',
                references: {
                    table: {
                        tableName: 'Organizations',
                        schema: schema,
                    },
                    field: 'organizationId',
                },
            }
        );

        await queryInterface.addConstraint(
            { schema: schema, tableName: 'Restaurants' },
            {
                fields: ['organizationId'],
                type: 'foreign key',
                name: 'restaurantsOrganizationIdForeignKey',
                references: {
                    table: {
                        tableName: 'Organizations',
                        schema: schema,
                    },
                    field: 'organizationId',
                },
            }
        );

        await queryInterface.addConstraint(
            { schema: schema, tableName: 'Shops' },
            {
                fields: ['organizationId'],
                type: 'foreign key',
                name: 'shopsOrganizationIdForeignKey',
                references: {
                    table: {
                        tableName: 'Organizations',
                        schema: schema,
                    },
                    field: 'organizationId',
                },
            }
        );

        await queryInterface.addConstraint(
            { schema: schema, tableName: 'Devices' },
            {
                fields: ['organizationId'],
                type: 'foreign key',
                name: 'devicesOrganizationIdForeignKey',
                references: {
                    table: {
                        tableName: 'Organizations',
                        schema: schema,
                    },
                    field: 'organizationId',
                },
            }
        );
    },

    async down(queryInterface) {
        await queryInterface.removeConstraint(
            { tableName: 'Beaches', schema: schema },
            'beachesOrganizationIdForeignKey'
        );

        await queryInterface.removeConstraint(
            { tableName: 'Sights', schema: schema },
            'sightsOrganizationIdForeignKey'
        );

        await queryInterface.removeConstraint(
            { tableName: 'Restaurants', schema: schema },
            'restaurantsOrganizationIdForeignKey'
        );

        await queryInterface.removeConstraint(
            { tableName: 'Shops', schema: schema },
            'shopsOrganizationIdForeignKey'
        );

        await queryInterface.removeConstraint(
            { tableName: 'Devices', schema: schema },
            'devicesOrganizationIdForeignKey'
        );
    },
};
