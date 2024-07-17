import Logger from './logger';
import { isDev } from '@config/config';
import { Shop } from '@models/shop';
import postgresLoader from './postgres';
import pgBossLoader from './pgboss';
import dependencyInjectorLoader from './dependencyInjector';
import expressLoader from './express';
import { Beach } from '@models/beach';
import { Sight } from '@models/sight';
import { Apartment } from '@models/apartment';
import { Device } from '@models/device';
import { Reservation } from '@models/reservation';
import { Restaurant } from '@models/restaurant';
import { Review } from '@models/review';
import { ShopApartment } from '@models/shopApartment';
import { BeachApartment } from '@models/beachApartment';
import { SightApartment } from '@models/sightApartment';
import { DeviceApartment } from '@models/deviceApartment';
import { User } from '@models/user';
import { Scraping } from '@models/scraping';
export default async ({ expressApp }) => {
    const postgresInstance = await postgresLoader();
    Logger.info('✌️ DB loaded and connected!');
    Logger.info('Server running in ' + isDev + ' mode.');
    const shopModel = {
        name: 'ShopModel',
        model: Shop,
    };
    const shopApartmentModel = {
        name: 'ShopApartmentModel',
        model: ShopApartment,
    };
    const beachModel = {
        name: 'BeachModel',
        model: Beach,
    };
    const beachApartmentModel = {
        name: 'BeachApartmentModel',
        model: BeachApartment,
    };
    const sightModel = {
        name: 'SightModel',
        model: Sight,
    };
    const sightApartmentModel = {
        name: 'SightApartmentModel',
        model: SightApartment,
    };
    const apartmentModel = {
        name: 'ApartmentModel',
        model: Apartment,
    };
    const deviceModel = {
        name: 'DeviceModel',
        model: Device,
    };
    const deviceApartmentModel = {
        name: 'DeviceApartmentModel',
        model: DeviceApartment,
    };
    const reservationModel = {
        name: 'ReservationModel',
        model: Reservation,
    };
    const restaurantModel = {
        name: 'RestaurantModel',
        model: Restaurant,
    };
    const reviewModel = {
        name: 'ReviewsModel',
        model: Review,
    };
    const userModel = {
        name: 'UserModel',
        model: User,
    };
    const scrapingModel = {
        name: 'ScrapingModel',
        model: Scraping,
    };
    const boss = pgBossLoader();

    await postgresInstance?.sync();

    dependencyInjectorLoader({
        boss,
        postgresConnection: postgresInstance,
        models: [
            scrapingModel,
            userModel,
            deviceApartmentModel,
            sightApartmentModel,
            beachApartmentModel,
            shopApartmentModel,
            reviewModel,
            restaurantModel,
            shopModel,
            beachModel,
            sightModel,
            apartmentModel,
            deviceModel,
            reservationModel,
        ],
    });

    Logger.info('✌️ Dependency Injector loaded');

    expressLoader({ app: expressApp });
    Logger.info('✌️ Express loaded');

    // webpush.setVapidDetails(
    //     'mailto:contact@apartment.app',
    //     process.env.VAPID_PUBLIC_KEY,
    //     process.env.VAPID_PRIVATE_KEY
    // );

    Logger.info('✌️ EWeb Push loaded');
};
