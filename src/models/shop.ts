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
import { ShopApartment } from '@models/shopApartment';
import { Apartment } from '@models/apartment';
import { DeviceApartment } from '@models/deviceApartment';

@Table({
    tableName: 'Shops',
})
export class Shop extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare shopId: string;

    @Column(DataType.STRING(50))
    declare title: string;

    @Column(DataType.STRING(1000))
    declare description: string;

    @Column(DataType.ARRAY(DataType.STRING))
    declare imagesUrl: string[];

    @Column(DataType.STRING)
    declare titleImage: string;

    @Column(DataType.GEOGRAPHY('Point'))
    declare location: number;

    @Column(DataType.UUID)
    @ForeignKey(() => User)
    declare ownerId: string;

    @BelongsTo(() => User)
    declare owner: User;

    @BelongsToMany(() => Apartment, () => ShopApartment)
    declare apartments: Apartment[];
}
