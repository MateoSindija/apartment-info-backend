import { Inject, Service } from 'typedi';
import { LoggerType } from '@loaders/logger';
import { Apartment } from '@models/apartment';
import { Beach } from '@models/beach';
import { Sight } from '@models/sight';
import { Device } from '@models/device';
import { Restaurant } from '@models/restaurant';
import { Shop } from '@models/shop';
import { Review } from '@models/review';
import { BeachApartment } from '@models/beachApartment';
import { ShopApartment } from '@models/shopApartment';
import { DeviceApartment } from '@models/deviceApartment';
import { RestaurantApartment } from '@models/restaurantApartment';

@Service()
export default class ApartmentService {
    constructor(@Inject('logger') private Logger: LoggerType) {}

    public async GetAllUserApartments(userId: string): Promise<Apartment[]> {
        this.Logger.info('Getting all user apartments!');

        const apartments = await Apartment.findAll({
            where: { ownerId: userId },
        });

        this.Logger.info('Found all apartments!');
        return apartments;
    }
    public async GetApartmentInfo(apartmentId: string): Promise<Apartment> {
        this.Logger.info('Getting apartment info!');

        const apartment = await Apartment.findByPk(apartmentId);

        if (!apartment) throw new Error("Apartment doesn't exists");

        this.Logger.info('Found apartment!');
        return apartment;
    }
    public async GetAllSightsInApartment(
        apartmentId: string
    ): Promise<Sight[]> {
        this.Logger.info('Getting all sights in apartment!');

        const sights = await Sight.findAll({
            include: [
                {
                    model: Apartment,
                    where: { apartmentId },
                    attributes: [],
                },
            ],
        });

        this.Logger.info('Found all sights!');
        return sights;
    }

    public async GetAllBeachesInApartment(
        apartmentId: string
    ): Promise<Beach[]> {
        this.Logger.info('Getting all beaches in apartment!');

        const beaches = await Beach.findAll({
            include: [
                {
                    model: Apartment,
                    where: { apartmentId },
                    attributes: [],
                },
            ],
        });

        this.Logger.info('Found all beaches!');
        return beaches;
    }
    public async GetAllShopsInApartment(apartmentId: string): Promise<Shop[]> {
        this.Logger.info('Getting all shops in apartment!');

        const shops = await Shop.findAll({
            include: [
                {
                    model: Apartment,
                    where: { apartmentId },
                    attributes: [],
                },
            ],
        });

        this.Logger.info('Found all shops!');
        return shops;
    }
    public async GetAllDevicesInApartment(
        apartmentId: string
    ): Promise<Device[]> {
        this.Logger.info('Getting all devices in apartment!');

        const devices = await Device.findAll({
            include: [
                {
                    model: Apartment,
                    where: { apartmentId },
                    attributes: [],
                },
            ],
        });

        this.Logger.info('Found all devices!');
        return devices;
    }
    public async GetAllRestaurantsInApartment(
        apartmentId: string
    ): Promise<Restaurant[]> {
        this.Logger.info('Getting all restaurants in apartment!');

        const restaurants = await Restaurant.findAll({
            include: [
                {
                    model: Apartment,
                    where: { apartmentId },
                    attributes: [],
                },
            ],
        });

        this.Logger.info('Found all restaurants!');
        return restaurants;
    }
    public async GetAllReviewsForApartment(
        apartmentId: string
    ): Promise<Review[]> {
        this.Logger.info('Getting all reviews for apartment!');

        const reviews = await Review.findAll({
            where: { apartmentId: apartmentId },
        });

        this.Logger.info('Found all reviews!');
        return reviews;
    }
    public async CreateApartment(
        name: string,
        lat: number,
        lng: number,
        address: string,
        userId: string
    ): Promise<string> {
        this.Logger.info('Creating new apartment!');

        const apartment = await Apartment.create({
            name: name,
            ownerId: userId,
            location: { type: 'Point', coordinates: [lng, lat] },
            address: address,
        });

        this.Logger.info('Created new apartment!');

        return apartment.apartmentId;
    }
}
