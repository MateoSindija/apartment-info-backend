import { Inject, Service } from 'typedi';
import { LoggerType } from '@loaders/logger';
import { Shop } from '@models/shop';
import { ForbiddenError } from '@errors/appError';
import { Apartment } from '@models/apartment';
import fs from 'fs';
import { ShopApartment } from '@models/apartmentShop';

@Service()
export default class ShopService {
    constructor(@Inject('logger') private Logger: LoggerType) {}

    public async UpdateImage(
        shopId: string,
        userId: string,
        imagesPath: string[]
    ): Promise<void> {
        this.Logger.info('Updating images!');

        const shop = await Shop.findByPk(shopId);
        if (shop?.ownerId !== userId)
            throw new ForbiddenError('You are not the owner of this object.');

        await shop.update({ imagesPath: imagesPath });

        this.Logger.info('Images updated');
    }
    public async DeleteImage(
        shopId: string,
        userId: string,
        imagePath: string
    ): Promise<void> {
        this.Logger.info('Deleting files!');

        const shop = await Shop.findByPk(shopId);
        if (shop?.ownerId !== userId)
            throw new ForbiddenError('You are not the owner of this object.');

        if (shop) {
            shop.imagesUrl = shop.imagesUrl.filter((url) => url !== imagePath);
            await shop.save();
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
        titleImage: string,
        userId: string
    ): Promise<string> {
        this.Logger.info('Creating new shop!');

        const apartment = await Apartment.findByPk(apartmentId);

        if (!apartment) throw new Error("This apartment doesn't exists");
        if (apartment.ownerId !== userId)
            throw new ForbiddenError('You are not owner of this apartment');

        const shop = await Shop.create({
            title: title,
            description: description,
            apartmentId: apartmentId,
            lat: lat,
            lng: lng,
            imagesUrl: imagePaths,
            ownerId: userId,
            titleImage: titleImage,
        });

        this.Logger.info('Created new shop!');

        await ShopApartment.create({
            shopId: shop.shopId,
            apartmentId: apartmentId,
        });

        return shop.shopId;
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

        const shop = await Shop.findByPk(shopId);
        if (shop?.ownerId !== userId)
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

    public async DeleteShop(
        shopId: string,
        userId: string,
        apartmentId: string
    ): Promise<void> {
        this.Logger.info('Deleting shop');
        const shop = await Shop.findByPk(shopId);

        if (!shop) {
            throw new Error('Shop not found');
        }

        if (shop.ownerId !== userId) {
            throw new ForbiddenError('You do not have access to this Shop');
        }

        await ShopApartment.destroy({
            where: { shopId: shopId, apartmentId: apartmentId },
        });

        const shopCountInApartmentAttraction = await ShopApartment.count({
            where: { shopId: shopId },
        });

        if (shopCountInApartmentAttraction === 0) {
            await shop.destroy();
        }

        this.Logger.info('Shop deleted');
    }
}
