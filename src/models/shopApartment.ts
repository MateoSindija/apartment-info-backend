import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from 'sequelize-typescript';
import { Apartment } from '@models/apartment';
import { Shop } from '@models/shop';

@Table({
    tableName: 'ShopApartment',
    timestamps: false,
})
export class ShopApartment extends Model {
    @ForeignKey(() => Apartment)
    @Column(DataType.UUID)
    declare apartmentId: string;

    @ForeignKey(() => Shop)
    @Column(DataType.UUID)
    declare shopId: string;

    @BelongsTo(() => Apartment)
    declare apartment: Apartment;

    @BelongsTo(() => Shop)
    declare shop: Shop;
}
