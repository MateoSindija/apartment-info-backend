'use strict';
const schema = process.env.DEV_POSTGRES_SCHEMA || 'public';
/** @type {import('sequelize-cli').Migration} */

async function addForeignKeyConstraint(
    queryInterface,
    schema,
    tableName,
    fieldName,
    referencedTable,
    referencedField
) {
    await queryInterface.addConstraint(
        { schema: schema, tableName: tableName },
        {
            fields: [fieldName],
            type: 'foreign key',
            name: `${tableName}_${fieldName}_fkey`,
            references: {
                table: {
                    tableName: referencedTable,
                    schema: schema,
                },
                field: referencedField,
            },
        }
    );
}

module.exports = {
    async up(queryInterface) {
        await addForeignKeyConstraint(
            queryInterface,
            schema,
            'SightApartment',
            'apartmentId',
            'Apartments',
            'apartmentId'
        );
        await addForeignKeyConstraint(
            queryInterface,
            schema,
            'SightApartment',
            'sightId',
            'Sights',
            'sightId'
        );

        await addForeignKeyConstraint(
            queryInterface,
            schema,
            'BeachApartment',
            'apartmentId',
            'Apartments',
            'apartmentId'
        );
        await addForeignKeyConstraint(
            queryInterface,
            schema,
            'BeachApartment',
            'beachId',
            'Beaches',
            'beachId'
        );

        await addForeignKeyConstraint(
            queryInterface,
            schema,
            'DeviceApartment',
            'apartmentId',
            'Apartments',
            'apartmentId'
        );
        await addForeignKeyConstraint(
            queryInterface,
            schema,
            'DeviceApartment',
            'deviceId',
            'Devices',
            'deviceId'
        );
    },

    async down(queryInterface) {
        // Removing foreign key constraints for ApartmentSight
        await queryInterface.removeConstraint(
            { schema: schema, tableName: 'SightApartment' },
            'SightApartment_apartmentId_fkey'
        );
        await queryInterface.removeConstraint(
            { schema: schema, tableName: 'SightApartment' },
            'SightApartment_sightId_fkey'
        );

        // Removing foreign key constraints for ApartmentBeach
        await queryInterface.removeConstraint(
            { schema: schema, tableName: 'BeachApartment' },
            'BeachApartment_apartmentId_fkey'
        );
        await queryInterface.removeConstraint(
            { schema: schema, tableName: 'BeachApartment' },
            'BeachApartment_beachId_fkey'
        );

        // Removing foreign key constraints for ApartmentDevice
        await queryInterface.removeConstraint(
            { schema: schema, tableName: 'DeviceApartment' },
            'DeviceApartment_apartmentId_fkey'
        );
        await queryInterface.removeConstraint(
            { schema: schema, tableName: 'DeviceApartment' },
            'DeviceApartment_deviceId_fkey'
        );
    },
};
