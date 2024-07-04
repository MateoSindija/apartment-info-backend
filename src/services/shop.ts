import { Inject, Service } from 'typedi';
import { LoggerType } from '@loaders/logger';
import { Shop } from '@models/shop';
import { Organization } from '@models/organization';
import { ForbiddenError } from '@errors/appError';
import { Apartment } from '@models/apartment';
import fs from 'fs';
import { Sight } from '@models/sight';

@Service()
export default class ShopService {
    constructor(@Inject('logger') private Logger: LoggerType) {}

    public async UpdateImage(
        shopId: string,
        userId: string,
        imagesPath: string[]
    ): Promise<void> {
        this.Logger.info('Updating images!');

        const shopWithOrganization = await Shop.findByPk(shopId, {
            include: [
                {
                    model: Organization,
                    required: true,
                },
            ],
        });
        if (shopWithOrganization?.organization.ownerId !== userId)
            throw new ForbiddenError('You are not the owner of this object.');

        await shopWithOrganization.update({ imagesPath: imagesPath });

        this.Logger.info('Images updated');
    }
    public async DeleteImage(
        shopId: string,
        userId: string,
        imagePath: string
    ): Promise<void> {
        this.Logger.info('Deleting files!');

        const shopWithOrganization = await Shop.findByPk(shopId, {
            include: [
                {
                    model: Organization,
                    required: true,
                },
            ],
        });
        if (shopWithOrganization?.organization.ownerId !== userId)
            throw new ForbiddenError('You are not the owner of this object.');

        if (shopWithOrganization) {
            shopWithOrganization.imagesUrl =
                shopWithOrganization.imagesUrl.filter(
                    (url) => url !== imagePath
                );
            await shopWithOrganization.save();
            await fs.unlink(imagePath, (err) => {
                if (err) this.Logger.error(err);
                else {
                    this.Logger.info('File deleted');
                }
            });
            this.Logger.info('Images updated');
        }

        this.Logger.info('Shop not found');
    }
    public async CreateShop(
        title: string,
        description: string,
        apartmentId: string,
        lat: number,
        lng: number,
        imagePaths: string[],
        titleImage: string
    ): Promise<string> {
        this.Logger.info('Creating new shop!');

        const apartment = await Apartment.findByPk(apartmentId);

        if (apartment?.organizationId) {
            const shop = await Shop.create({
                title: title,
                description: description,
                apartmentId: apartmentId,
                lat: lat,
                lng: lng,
                imagesUrl: imagePaths,
                organizationId: apartment.organizationId,
                titleImage: titleImage,
            });

            this.Logger.info('Created new shop!');
            return shop.shopId;
        }

        this.Logger.info('Failed to find apartment!');

        return '';
    }
    public async UpdateShop(
        title: string,
        description: string,
        userId: string,
        lat: number,
        lng: number,
        shopId: string,
        titleImage: string
    ): Promise<void> {
        this.Logger.info('Updating shop!');

        const shopWithOrganization = await Shop.findByPk(shopId, {
            include: [
                {
                    model: Organization,
                    required: true,
                },
            ],
        });
        if (shopWithOrganization?.organization.ownerId !== userId)
            throw new ForbiddenError('You are not the owner of this object.');

        await Shop.update(
            {
                title: title,
                description: description,
                lat: lat,
                lng: lng,
                titleImage: titleImage,
            },
            { where: { shopId: shopId } }
        );

        this.Logger.info('Updated shop!');
    }

    public async DeleteShop(shopId: string, userId: string): Promise<void> {
        this.Logger.info('Deleting shop');

        const shop = await Sight.findByPk(shopId, {
            include: [{ model: Organization, required: true }],
        });

        if (shop?.organization.ownerId !== userId) {
            throw new ForbiddenError('You dont have access to this Shop');
        }

        if (!shop) throw new Error('Shop not found');
        await shop.destroy();

        this.Logger.info('Shop deleted');
    }
}
