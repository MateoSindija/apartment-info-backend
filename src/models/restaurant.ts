import {
    BelongsTo,
    Column,
    DataType,
    Default,
    ForeignKey,
    HasMany,
    Model,
    PrimaryKey,
    Table,
} from 'sequelize-typescript';
import { Apartment } from '@models/apartment';
import { User } from '@models/user';
import { ApartmentAttraction } from '@models/apartmentAttraction';

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

    @Column(DataType.DOUBLE)
    declare lat: number;

    @Column(DataType.DOUBLE)
    declare lng: number;

    @Column(DataType.DOUBLE)
    declare review: number;

    @Column(DataType.INTEGER)
    declare reviewAmount: number;

    @Column(DataType.STRING)
    declare emailContact: string;

    @Column(DataType.STRING)
    declare phoneContact: string;

    @Column(DataType.UUID)
    @ForeignKey(() => Apartment)
    declare apartmentId: string;

    @BelongsTo(() => Apartment)
    declare apartment: Apartment;

    @Column(DataType.UUID)
    @ForeignKey(() => User)
    declare ownerId: string;

    @BelongsTo(() => User)
    declare owner: User;

    @HasMany(() => ApartmentAttraction, 'attractionId')
    declare apartmentAttractions: ApartmentAttraction[];
}
