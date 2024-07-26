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
import { Apartment } from '@models/apartment';

@Table({
    tableName: 'AboutUs',
})
export class AboutUs extends Model {
    @PrimaryKey
    @ForeignKey(() => Apartment)
    @Column(DataType.UUID)
    declare apartmentId: string;

    @Column(DataType.STRING(100))
    declare moto: string;

    @Column(DataType.ARRAY(DataType.STRING))
    declare imagesUrl: string[];

    @Column(DataType.STRING)
    declare titleImage: string;

    @Column(DataType.STRING(1000))
    declare aboutUs: string;

    @BelongsTo(() => Apartment)
    declare apartment: Apartment;
}
