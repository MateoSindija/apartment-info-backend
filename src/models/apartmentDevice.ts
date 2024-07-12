import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from 'sequelize-typescript';
import { Apartment } from '@models/apartment';
import { Device } from '@models/device';

@Table({
    tableName: 'DeviceApartment',
})
export class DeviceApartment extends Model {
    @ForeignKey(() => Apartment)
    @Column(DataType.UUID)
    declare apartmentId: string;

    @ForeignKey(() => Device)
    @Column(DataType.UUID)
    declare deviceId: string;

    @BelongsTo(() => Apartment)
    declare apartment: Apartment;

    @BelongsTo(() => Device)
    declare device: Device;
}
