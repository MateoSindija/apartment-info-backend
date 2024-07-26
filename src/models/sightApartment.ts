import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from 'sequelize-typescript';
import { Apartment } from '@models/apartment';
import { Sight } from '@models/sight';
import { Device } from '@models/device';

@Table({
    tableName: 'SightApartment',
    timestamps: false,
})
export class SightApartment extends Model {
    @ForeignKey(() => Apartment)
    @Column(DataType.UUID)
    declare apartmentId: string;

    @ForeignKey(() => Sight)
    @Column(DataType.UUID)
    declare sightId: string;

    @BelongsTo(() => Apartment)
    declare apartment: Apartment;

    @BelongsTo(() => Sight)
    declare sights: Sight;
}
