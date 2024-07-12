import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from 'sequelize-typescript';
import { Apartment } from '@models/apartment';
import { Beach } from '@models/beach';

@Table({
    tableName: 'BeachApartment',
})
export class BeachApartment extends Model {
    @ForeignKey(() => Apartment)
    @Column(DataType.UUID)
    declare apartmentId: string;

    @ForeignKey(() => Beach)
    @Column(DataType.UUID)
    declare beachId: string;

    @BelongsTo(() => Apartment)
    declare apartment: Apartment;

    @BelongsTo(() => Beach)
    declare beach: Beach;
}
