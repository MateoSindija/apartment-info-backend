'use strict';
const { DataType } = require('sequelize-typescript');
const schema = process.env.DEV_POSTGRES_SCHEMA || 'public';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        const message = await queryInterface.createTable(
            {
                schema: schema,
                tableName: 'Messages',
            },
            {
                messageId: {
                    allowNull: false,
                    primaryKey: true,
                    defaultValue: DataType.UUIDV4,
                    type: DataType.UUID,
                },
                creatorId: {
                    foreignKey: true,
                    type: DataType.UUID,
                },
                recipientId: {
                    foreignKey: true,
                    type: DataType.UUID,
                },
                messageBody: {
                    type: DataType.STRING,
                },
                isRead: {
                    defaultValue: false,
                    type: DataType.BOOLEAN,
                },
                createdAt: {
                    allowNull: false,
                    type: DataType.DATE,
                },
            }
        );

        message.associates = (models) => {
            message.belongsTo(models.User, {
                foreignKey: 'creatorId',
            });
            message.belongsTo(models.User, {
                foreignKey: 'recipientId',
            });
        };
    },

    async down(queryInterface) {
        await queryInterface.dropTable({
            schema: schema,
            tableName: 'Messages',
        });
    },
};
