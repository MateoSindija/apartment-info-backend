import { Inject, Service } from 'typedi';
import { LoggerType } from '@loaders/logger';
import { Organization } from '@models/organization';
import { ForbiddenError } from '@errors/appError';
import { Apartment } from '@models/apartment';
import fs from 'fs';
import { Restaurant } from '@models/restaurant';

@Service()
export default class RestaurantService {
    constructor(@Inject('logger') private Logger: LoggerType) {}

    public async UpdateImage(
        beachId: string,
        userId: string,
        imagesPath: string[]
    ): Promise<void> {
        this.Logger.info('Updating images!');

        const restaurantWithOrganization = await Restaurant.findByPk(beachId, {
            include: [
                {
                    model: Organization,
                    required: true,
                },
            ],
        });
        if (restaurantWithOrganization?.organization.ownerId !== userId)
            throw new ForbiddenError('You are not the owner of this object.');

        await restaurantWithOrganization.update({ imagesPath: imagesPath });

        this.Logger.info('Images updated');
    }
    public async DeleteImage(
        beachId: string,
        userId: string,
        imagePath: string
    ): Promise<void> {
        this.Logger.info('Deleting files!');

        const restaurantWithOrganization = await Restaurant.findByPk(beachId, {
            include: [
                {
                    model: Organization,
                    required: true,
                },
            ],
        });
        if (restaurantWithOrganization?.organization.ownerId !== userId)
            throw new ForbiddenError('You are not the owner of this object.');

        if (restaurantWithOrganization) {
            restaurantWithOrganization.imagesUrl =
                restaurantWithOrganization.imagesUrl.filter(
                    (url) => url !== imagePath
                );
            await restaurantWithOrganization.save();
            await fs.unlink(imagePath, (err) => {
                if (err) this.Logger.error(err);
                else {
                    this.Logger.info('File deleted');
                }
            });
            this.Logger.info('Images updated');
        }

        this.Logger.info('Beach not found');
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
        titleImage: string
    ): Promise<string> {
        this.Logger.info('Creating new Restaurant!');

        const apartment = await Apartment.findByPk(apartmentId);

        if (apartment?.organizationId) {
            const restaurant = await Restaurant.create({
                title: title,
                description: description,
                apartmentId: apartmentId,
                emailContact: emailContact,
                phoneContact: phoneContact,
                review: review,
                reviewAmount: reviewAmount,
                lat: lat,
                lng: lng,
                imagesUrl: imagePaths,
                organizationId: apartment.organizationId,
                titleImage: titleImage,
            });

            this.Logger.info('Created new Restaurant!');
            return restaurant.restaurantId;
        }

        this.Logger.info('Failed to find apartment!');

        return '';
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
        titleImage: string
    ): Promise<void> {
        this.Logger.info('Updating Restaurant!');

        const restaurantWithOrganization = await Restaurant.findByPk(
            restaurantId,
            {
                include: [
                    {
                        model: Organization,
                        required: true,
                    },
                ],
            }
        );
        if (restaurantWithOrganization?.organization.ownerId !== userId)
            throw new ForbiddenError('You are not the owner of this object.');

        await Restaurant.update(
            {
                title: title,
                description: description,
                emailContact: emailContact,
                phoneContact: phoneContact,
                review: review,
                reviewAmount: reviewAmount,
                lat: lat,
                lng: lng,
                titleImage: titleImage,
            },
            { where: { restaurantId: restaurantId } }
        );

        this.Logger.info('Updated Restaurant!');
    }

    public async DeleteRestaurant(
        restaurantId: string,
        userId: string
    ): Promise<void> {
        this.Logger.info('Deleting restaurant');

        const restaurant = await Restaurant.findByPk(restaurantId, {
            include: [{ model: Organization, required: true }],
        });

        if (restaurant?.organization.ownerId !== userId) {
            throw new ForbiddenError('You dont have access to this Restaurant');
        }

        if (!restaurant) throw new Error('Restaurant not found');
        await restaurant.destroy();

        this.Logger.info('Restaurant deleted');
    }
}
