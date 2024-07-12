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
            { schema: schema, tableName: 'ApartmentSight' },
            'ApartmentSight_apartmentId_fkey'
        );
        await queryInterface.removeConstraint(
            { schema: schema, tableName: 'ApartmentSight' },
            'ApartmentSight_sightId_fkey'
        );

        // Removing foreign key constraints for ApartmentBeach
        await queryInterface.removeConstraint(
            { schema: schema, tableName: 'ApartmentBeach' },
            'ApartmentBeach_apartmentId_fkey'
        );
        await queryInterface.removeConstraint(
            { schema: schema, tableName: 'ApartmentBeach' },
            'ApartmentBeach_beachId_fkey'
        );

        // Removing foreign key constraints for ApartmentDevice
        await queryInterface.removeConstraint(
            { schema: schema, tableName: 'ApartmentDevice' },
            'ApartmentDevice_apartmentId_fkey'
        );
        await queryInterface.removeConstraint(
            { schema: schema, tableName: 'ApartmentDevice' },
            'ApartmentDevice_deviceId_fkey'
        );
    },
};
