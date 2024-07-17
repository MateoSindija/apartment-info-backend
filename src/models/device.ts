import {
    BelongsTo,
    BelongsToMany,
    Column,
    DataType,
    Default,
    ForeignKey,
    HasMany,
    Model,
    PrimaryKey,
    Table,
} from 'sequelize-typescript';
import { User } from '@models/user';
import { DeviceApartment } from '@models/deviceApartment';
import { Apartment } from '@models/apartment';

@Table({
    tableName: 'Devices',
})
export class Device extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare deviceId: string;

    @Column(DataType.STRING(50))
    declare title: string;

    @Column(DataType.STRING(1000))
    declare description: string;

    @Column(DataType.ARRAY(DataType.STRING))
    declare imagesUrl: string[];

    @Column(DataType.STRING)
    declare titleImage: string;

    @Column(DataType.UUID)
    @ForeignKey(() => User)
    declare ownerId: string;

    @BelongsTo(() => User)
    declare owner: User;

    @BelongsToMany(() => Apartment, () => DeviceApartment)
    declare apartments: Apartment[];
}
