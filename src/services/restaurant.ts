import { Inject, Service } from 'typedi';
import { LoggerType } from '@loaders/logger';
import { ForbiddenError } from '@errors/appError';
import { Apartment } from '@models/apartment';
import { Restaurant } from '@models/restaurant';
import { RestaurantApartment } from '@models/restaurantApartment';
import {
    deleteImage,
    handleImageUrls,
    handleTitleImage,
} from '@utils/functions';

@Service()
export default class RestaurantService {
    constructor(@Inject('logger') private Logger: LoggerType) {}

    public async GetRestaurantById(restaurantId: string): Promise<Restaurant> {
        this.Logger.info('Getting restaurant!');

        const restaurant = await Restaurant.findByPk(restaurantId, {
            include: Apartment,
        });

        if (!restaurant) {
            throw new Error('Restaurant not found');
        }

        this.Logger.info('Found restaurant!');
        return restaurant;
    }

    public async UpdateImage(
        restaurantId: string,
        userId: string,
        imagesPath: string[]
    ): Promise<void> {
        this.Logger.info('Updating images!');

        const restaurant = await Restaurant.findByPk(restaurantId);
        if (restaurant?.ownerId !== userId)
            throw new ForbiddenError('You are not the owner of this object.');

        await restaurant.update({ imagesPath: imagesPath });

        this.Logger.info('Images updated');
    }
    public async CreateRestaurant(
        title: string,
        description: string,
        apartmentId: string,
        lat: number,
        lng: number,
        emailContact: string,
        phoneContact: string,
        review: number,
        reviewAmount: number,
        imagePaths: string[],
        titleImage: string,
        userId: string
    ): Promise<string> {
        this.Logger.info('Creating new Restaurant!');

        const apartment = await Apartment.findByPk(apartmentId);

        if (!apartment) throw new Error("This apartment doesn't exists");
        if (apartment.ownerId !== userId)
            throw new ForbiddenError('You are not owner of this apartment');

        const restaurant = await Restaurant.create({
            title: title,
            description: description,
            apartmentId: apartmentId,
            emailContact: emailContact,
            phoneContact: phoneContact,
            review: review,
            reviewAmount: reviewAmount,
            location: { type: 'Point', coordinates: [lng, lat] },
            imagesUrl: imagePaths,
            ownerId: userId,
            titleImage: titleImage,
        });

        this.Logger.info('Created new Restaurant!');

        await RestaurantApartment.create({
            restaurantId: restaurant.restaurantId,
            apartmentId: apartment.apartmentId,
        });

        return restaurant.restaurantId;
    }
    public async UpdateRestaurant(
        title: string,
        description: string,
        userId: string,
        lat: number,
        lng: number,
        emailContact: string,
        phoneContact: string,
        review: number,
        reviewAmount: number,
        restaurantId: string,
        titleImage: string,
        imagesPath: string[] | undefined,
        imagesUrlArray: string[] | undefined
    ): Promise<void> {
        this.Logger.info('Updating Restaurant!');

        const restaurant = await Restaurant.findByPk(restaurantId);

        if (restaurant?.ownerId !== userId)
            throw new ForbiddenError('You are not the owner of this object.');

        const existingImagesUrl = restaurant.imagesUrl || [];

        const imagesToDelete = existingImagesUrl.filter(
            (imageUrl) => !imagesUrlArray?.includes(imageUrl)
        );
        for (const imageUrl of imagesToDelete) {
            await deleteImage(imageUrl);
        }

        console.log(description);

        await Restaurant.update(
            {
                title: title,
                description: description,
                emailContact: emailContact,
                phoneContact: phoneContact,
                review: review,
                reviewAmount: reviewAmount,
                location: { type: 'Point', coordinates: [lng, lat] },
                imagesUrl: handleImageUrls(imagesPath, imagesUrlArray),
                titleImage: handleTitleImage(titleImage, imagesPath),
            },
            { where: { restaurantId: restaurantId } }
        );

        this.Logger.info('Updated Restaurant!');
    }

    public async DeleteRestaurant(
        restaurantId: string,
        userId: string,
        apartmentId: string
    ): Promise<void> {
        this.Logger.info('Deleting restaurant');

        const restaurant = await Restaurant.findByPk(restaurantId);

        if (!restaurant) {
            throw new Error('Restaurant not found');
        }

        if (restaurant.ownerId !== userId) {
            throw new ForbiddenError(
                'You do not have access to this Restaurant'
            );
        }

        await RestaurantApartment.destroy({
            where: { restaurantId: restaurantId, apartmentId: apartmentId },
        });

        const restaurantCountInApartmentAttraction =
            await RestaurantApartment.count({
                where: {
                    restaurantId: restaurantId,
                },
            });

        if (restaurantCountInApartmentAttraction === 0) {
            for (const imgPath of restaurant.imagesUrl) {
                await deleteImage(imgPath);
            }
            await restaurant.destroy();
        }

        this.Logger.info('Restaurant deleted');
    }
}
