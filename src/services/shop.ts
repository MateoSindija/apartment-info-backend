import { Inject, Service } from 'typedi';
import { LoggerType } from '@loaders/logger';
import { Shop } from '@models/shop';
import { ForbiddenError } from '@errors/appError';
import { Apartment } from '@models/apartment';
import { ShopApartment } from '@models/shopApartment';
import {
    deleteImage,
    handleImageUrls,
    handleTitleImage,
} from '@utils/functions';
@Service()
export default class ShopService {
    constructor(@Inject('logger') private Logger: LoggerType) {}

    public async GetShopById(shopId: string): Promise<Shop> {
        this.Logger.info('Getting all shops!');

        const shop = await Shop.findByPk(shopId);

        if (!shop) {
            throw new Error('Shop not found');
        }

        this.Logger.info('Found shop!');
        return shop;
    }
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
            location: { type: 'Point', coordinates: [lng, lat] },
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
        titleImage: string,
        imagesPath: string[] | undefined,
        imagesUrlArray: string[] | undefined
    ): Promise<void> {
        this.Logger.info('Updating shop!');

        const shop = await Shop.findByPk(shopId);
        if (shop?.ownerId !== userId)
            throw new ForbiddenError('You are not the owner of this object.');

        const existingImagesUrl = shop.imagesUrl || [];

        const imagesToDelete = existingImagesUrl.filter(
            (imageUrl) => !imagesUrlArray?.includes(imageUrl)
        );
        for (const imageUrl of imagesToDelete) {
            await deleteImage(imageUrl);
        }

        await Shop.update(
            {
                title: title,
                description: description,
                location: { type: 'Point', coordinates: [lng, lat] },
                imagesUrl: handleImageUrls(imagesPath, imagesUrlArray),
                titleImage: handleTitleImage(titleImage, imagesPath),
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
            for (const imgPath of shop.imagesUrl) {
                await deleteImage(imgPath);
            }
            await shop.destroy();
        }

        this.Logger.info('Shop deleted');
    }
}
