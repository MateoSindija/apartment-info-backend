import {Inject, Service} from 'typedi';
import {LoggerType} from '@loaders/logger';
import {Apartment} from '@models/apartment';
import {Beach} from '@models/beach';
import {Sight} from '@models/sight';
import {Device} from '@models/device';
import {Restaurant} from '@models/restaurant';
import {Shop} from '@models/shop';
import {Review} from '@models/review';
import {AboutUs} from '@models/aboutUs';
import {handleImageUrls, handleTitleImage} from '@utils/functions';
import {Reservation} from '@models/reservation';
import {Op} from 'sequelize';
import moment from 'moment-timezone';

@Service()
export default class ApartmentService {
    constructor(@Inject('logger') private Logger: LoggerType) {
    }

    public async GetReservationByApartment(
        apartmentId: string
    ): Promise<Reservation[]> {
        this.Logger.info('Getting Reservation periods for apartment!');

        return await Reservation.findAll({
            where: {apartmentId: apartmentId},
            order: [['endDate', 'DESC']],
        });
    }

    public async GetCurrentReservationForApartment(
        apartmentId: string
    ): Promise<Reservation | null> {
        this.Logger.info('Getting Current Reservation for apartment!');

        const now = moment().tz('Europe/Berlin').startOf('day').toDate();

        return await Reservation.findOne({
            where: {
                apartmentId: apartmentId,
                startDate: {[Op.lte]: now},
                endDate: {[Op.gte]: now},
            },
        });
    }

    public async GetAllUserApartments(userId: string): Promise<Apartment[]> {
        this.Logger.info('Getting all user apartments!');

        const apartments = await Apartment.findAll({
            where: {ownerId: userId},
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
                    where: {apartmentId},
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
        this.Logger.info('Getting all beach in apartment!');

        const beaches = await Beach.findAll({
            include: [
                {
                    model: Apartment,
                    where: {apartmentId},
                    attributes: [],
                },
            ],
        });

        this.Logger.info('Found all beach!');
        return beaches;
    }

    public async GetAllShopsInApartment(apartmentId: string): Promise<Shop[]> {
        this.Logger.info('Getting all shops in apartment!');

        const shops = await Shop.findAll({
            include: [
                {
                    model: Apartment,
                    where: {apartmentId},
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
                    where: {apartmentId},
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
                    where: {apartmentId},
                    attributes: [],
                },
            ],
        });

        this.Logger.info('Found all restaurants!');
        return restaurants;
    }

    public async GetAllReviewsForApartment(apartmentId: string): Promise<{
        reviews: Review[];
        avgComfort: number;
        avgOverall: number;
        avgValue: number;
        avgRating: number;
        ratingChangePercentage: number;
        totalReservationsCount: number;
    }> {
        this.Logger.info('Getting all reviews for apartment!');

        const now = moment().tz('Europe/Berlin').startOf('day').toDate();
        const oneYearAgo = moment()
            .tz('Europe/Berlin')
            .subtract(8, 'months')
            .startOf('day')
            .toDate();

        const reviews = await Review.findAll({
            where: {
                apartmentId: apartmentId,
            },
            include: [
                {
                    model: Reservation,
                    required: true,
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        const reservations = await Reservation.findAll({
            where: {
                apartmentId: apartmentId,
                startDate: {[Op.lte]: now},
            },
        });

        const lastYearReviews = await Review.findAll({
            where: {
                apartmentId: apartmentId,
                createdAt: {
                    [Op.lt]: oneYearAgo,
                    [Op.gte]: moment(oneYearAgo).subtract(8, 'months').toDate(),
                },
            },
        });

        const avgComfort =
            reviews.reduce((acc, review) => acc + review.comfortRating, 0) /
            reviews.length;

        const avgValue =
            reviews.reduce((acc, review) => acc + review.valueRating, 0) /
            reviews.length;

        const avgOverallExp =
            reviews.reduce((acc, review) => acc + review.experienceRating, 0) /
            reviews.length;

        const avgRatingLastYear = lastYearReviews.length
            ? lastYearReviews.reduce(
            (acc, review) =>
                acc +
                ((review.comfortRating || 0) +
                    (review.valueRating || 0) +
                    (review.experienceRating || 0)) /
                3,
            0
        ) / lastYearReviews.length
            : undefined;

        const avgRating = (avgComfort + avgValue + avgOverallExp) / 3;

        let ratingChangePercentage = 0;
        if (avgRatingLastYear !== undefined && avgRatingLastYear > 0) {
            ratingChangePercentage =
                ((avgRating - avgRatingLastYear) / avgRatingLastYear) * 100;
        }

        const reviewData = {
            reviews: reviews,
            avgComfort: avgComfort,
            avgOverall: avgOverallExp,
            avgValue: avgValue,
            avgRating: avgRating,
            ratingChangePercentage: ratingChangePercentage,
            totalReservationsCount: reservations.length,
        };
        this.Logger.info('Found all reviews!');
        return reviewData;
    }

    public async GetAboutUs(apartmentId: string): Promise<AboutUs | null> {
        this.Logger.info('Getting about us for apartment!');

        const aboutUs = await AboutUs.findByPk(apartmentId);

        this.Logger.info('Found about us!');
        return aboutUs;
    }

    public async CreateAboutUs(
        apartmentId: string,
        moto: string,
        aboutUs: string,
        imagesUrl: string[],
        titleImage: string
    ): Promise<void> {
        this.Logger.info('Creating about us for apartment!');

        await AboutUs.create({
            apartmentId: apartmentId,
            moto: moto,
            aboutUs: aboutUs,
            imagesUrl: imagesUrl,
            titleImage: titleImage,
        });

        this.Logger.info('Created about us!');
    }

    public async UpdateAboutUs(
        apartmentId: string,
        moto: string,
        aboutUs: string,
        imagesPath: string[] | undefined,
        titleImage: string,
        imagesUrlArray: string[] | undefined
    ): Promise<void> {
        this.Logger.info('Creating about us for apartment!');

        await AboutUs.update(
            {
                moto: moto,
                aboutUs: aboutUs,
                imagesUrl: handleImageUrls(imagesPath, imagesUrlArray),
                titleImage: handleTitleImage(titleImage, imagesPath),
            },
            {where: {apartmentId: apartmentId}}
        );

        this.Logger.info('Updated about us!');
    }

    public async CreateApartment(
        name: string,
        lat: number,
        lng: number,
        address: string,
        userId: string,
        apartmentPassword: string
    ): Promise<string> {
        this.Logger.info('Creating new apartment!');

        const apartment = await Apartment.create({
            name: name,
            ownerId: userId,
            location: {type: 'Point', coordinates: [lng, lat]},
            address: address,
            apartmentPassword: apartmentPassword,
        });

        this.Logger.info('Created new apartment!');

        return apartment.apartmentId;
    }

    public async UpdateApartment(
        name: string,
        lat: number,
        lng: number,
        address: string,
        apartmentId: string,
        apartmentPassword: string
    ): Promise<void> {
        this.Logger.info('Updating apartment!');

        await Apartment.update(
            {
                name: name,
                location: {type: 'Point', coordinates: [lng, lat]},
                address: address,
                apartmentPassword: apartmentPassword,
            },
            {where: {apartmentId: apartmentId}}
        );

        this.Logger.info('Updated apartment!');
    }
}
