'use strict';
const { DataType } = require('sequelize-typescript');
const schema = process.env.DEV_POSTGRES_SCHEMA || 'public';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        const review = await queryInterface.createTable(
            { schema: schema, tableName: 'Reviews' },
            {
                reviewId: {
                    allowNull: false,
                    primaryKey: true,
                    type: DataType.UUID,
                    defaultValue: DataType.UUIDV4,
                },
                apartmentId: {
                    foreignKey: true,
                    type: DataType.UUID,
                },
                comfortRating: {
                    type: DataType.SMALLINT,
                },
                experienceRating: {
                    type: DataType.SMALLINT,
                },
                valueRating: {
                    type: DataType.SMALLINT,
                },
                review: {
                    optional: true,
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

        review.associates = (models) => {
            review.belongsTo(models.Apartment, {
                foreignKey: 'apartmentId',
            });
        };
    },

    async down(queryInterface) {
        await queryInterface.dropTable({
            schema: schema,
            tableName: 'Reviews',
        });
    },
};
