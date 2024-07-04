'use strict';

const { DataType } = require('sequelize-typescript');
const schema = process.env.DEV_POSTGRES_SCHEMA || 'public';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        await queryInterface.createTable(
            { schema: schema, tableName: 'Users' },
            {
                userId: {
                    allowNull: false,
                    primaryKey: true,
                    type: DataType.UUID,
                    defaultValue: DataType.UUIDV4,
                },
                firstName: {
                    type: DataType.STRING,
                },
                emailVerified: {
                    type: DataType.BOOLEAN,
                },
                lastName: {
                    type: DataType.STRING,
                },
                email: {
                    type: DataType.STRING,
                },
                password: {
                    type: DataType.STRING,
                },
                verificationCode: {
                    type: DataType.UUID,
                    allowNull: true,
                },
                resetCode: {
                    type: DataType.UUID,
                    allowNull: true,
                },
                loginKey: {
                    type: DataType.UUID,
                    allowNull: true,
                },
                imagePath: {
                    type: DataType.STRING,
                    allowNull: true,
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
        await queryInterface.dropTable({ schema: schema, tableName: 'Users' });
    },
};
