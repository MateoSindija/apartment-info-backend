import {
    BelongsTo,
    BelongsToMany,
    Column,
    DataType,
    Default,
    ForeignKey,
    Model,
    PrimaryKey,
    Table,
} from 'sequelize-typescript';
import { Apartment } from '@models/apartment';
import { User } from '@models/user';
import { RestaurantApartment } from '@models/restaurantApartment';

@Table({
    tableName: 'Restaurants',
})
export class Restaurant extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare restaurantId: string;

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

    @Column(DataType.DOUBLE)
    declare review: number;

    @Column(DataType.INTEGER)
    declare reviewAmount: number;

    @Column(DataType.STRING)
    declare emailContact: string;

    @Column(DataType.STRING)
    declare phoneContact: string;

    @Column(DataType.UUID)
    @ForeignKey(() => User)
    declare ownerId: string;

    @BelongsTo(() => User)
    declare owner: User;

    @BelongsToMany(() => Apartment, () => RestaurantApartment)
    declare apartments: Apartment[];
}
