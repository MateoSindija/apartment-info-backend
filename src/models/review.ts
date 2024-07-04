import {
    BelongsTo,
    Column,
    DataType,
    Default,
    ForeignKey,
    Model,
    PrimaryKey,
    Table,
} from 'sequelize-typescript';
import { Apartment } from '@models/apartment';

@Table({
    tableName: 'Reviews',
})
export class Review extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare reviewId: string;

    @Column(DataType.SMALLINT)
    declare comfortRating: number;

    @Column(DataType.SMALLINT)
    declare experienceRating: number;

    @Column(DataType.SMALLINT)
    declare valueRating: number;

    @Column(DataType.STRING)
    declare review: string | null;

    @Column(DataType.UUID)
    @ForeignKey(() => Apartment)
    declare apartmentId: string;

    @BelongsTo(() => Apartment)
    declare apartment: Apartment;
}
