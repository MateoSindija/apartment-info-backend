import {
    Column,
    DataType,
    ForeignKey,
    Model,
    Table,
} from 'sequelize-typescript';
import { Apartment } from '@models/apartment';
import { Restaurant } from '@models/restaurant';

@Table({
    tableName: 'RestaurantApartment',
    timestamps: false,
})
export class RestaurantApartment extends Model {
    @ForeignKey(() => Apartment)
    @Column(DataType.UUID)
    declare apartmentId: string;

    @ForeignKey(() => Restaurant)
    @Column(DataType.UUID)
    declare restaurantId: string;
}
