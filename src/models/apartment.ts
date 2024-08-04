import {
    BelongsTo,
    BelongsToMany,
    Column,
    DataType,
    Default,
    ForeignKey,
    HasMany,
    HasOne,
    Model,
    PrimaryKey,
    Table,
} from 'sequelize-typescript';
import { User } from '@models/user';
import { Reservation } from '@models/reservation';
import { Scraping } from '@models/scraping';
import { Restaurant } from '@models/restaurant';
import { RestaurantApartment } from '@models/restaurantApartment';
import { SightApartment } from '@models/sightApartment';
import { Beach } from '@models/beach';
import { BeachApartment } from '@models/beachApartment';
import { Device } from '@models/device';
import { DeviceApartment } from '@models/deviceApartment';
import { Sight } from '@models/sight';
import { ShopApartment } from '@models/shopApartment';
import { Shop } from '@models/shop';
import { AboutUs } from '@models/aboutUs';

@Table({
    tableName: 'Apartments',
})
export class Apartment extends Model {
    @PrimaryKey
    @Default(DataType.UUIDV4)
    @Column(DataType.UUID)
    declare apartmentId: string;

    @Column(DataType.STRING(50))
    declare name: string;

    @Column(DataType.STRING(80))
    declare address: string;

    @Column(DataType.STRING)
    declare apartmentPassword: string;

    @Column(DataType.GEOGRAPHY('Point'))
    declare location: number;

    @ForeignKey(() => User)
    @Column(DataType.UUID)
    declare ownerId: string;

    @HasMany(() => Reservation)
    declare reservations: Reservation[];

    @HasMany(() => Scraping)
    declare scrapingLinks: Scraping[];

    @BelongsTo(() => User)
    declare owner: User;

    @HasOne(() => AboutUs)
    declare aboutUs: AboutUs;

    @BelongsToMany(() => Restaurant, () => RestaurantApartment)
    declare restaurants: Restaurant[];

    @BelongsToMany(() => Beach, () => BeachApartment)
    declare beaches: Beach[];

    @BelongsToMany(() => Device, () => DeviceApartment)
    declare devices: Device[];

    @BelongsToMany(() => Sight, () => SightApartment)
    declare sights: Sight[];

    @BelongsToMany(() => Shop, () => ShopApartment)
    declare shops: Shop[];
}
