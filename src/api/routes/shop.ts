import { TokenRequest, userAuth } from '@api/middlewares/privateRoute';
import { LoggerType } from '@loaders/logger';
import Container from 'typedi';
import { NewShopDTO, ParamShopUUID, UpdateShopDTO } from '@interfaces/shop';
import ShopService from '@services/shop';
import { Router, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
    validateRequestBody,
    validateRequestParams,
} from 'zod-express-middleware';
import { uploadImages } from '@utils/functions';
import { ParamApartmentUUID } from '@interfaces/apartment';
import AttractionsFromOwnerService from '@services/attractionsFromOwner';
import { Shop } from '@models/shop';
import { ParamExistingDeviceUUID } from '@interfaces/device';
import { ShopApartment } from '@models/shopApartment';
const route = Router();

export default (app: Router) => {
    app.use('/shop', route);

    route.post(
        '/new',
        userAuth,
        uploadImages('public/uploads/shop').array('images'),
        validateRequestBody(NewShopDTO),
        async (
            req: TokenRequest & {
                body: z.infer<typeof NewShopDTO>;
                // files: Express.Multer.File[];
            },
            res: Response,
            next: NextFunction
        ) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling New Shop endpoint');
            try {
                const userID = req.decoded.id;
                const shopServiceInstance = Container.get(ShopService);
                const {
                    title,
                    description,
                    apartmentId,
                    lat,
                    lng,
                    titleImage,
                } = req.body;

                const imagesPath: string[] = (
                    req.files as Express.Multer.File[]
                ).map((file: Express.Multer.File) => file.path);

                if (titleImage >= imagesPath.length) {
                    throw new Error('Invalid titleImage chosen!');
                }

                const shopId = await shopServiceInstance.CreateShop(
                    title,
                    description,
                    apartmentId,
                    lat,
                    lng,
                    imagesPath,
                    imagesPath[titleImage],
                    userID
                );

                res.status(200).json({ shopId });
            } catch (e) {
                return next(e);
            }
        }
    );

    route.post(
        '/:attractionId/existing/:apartmentId',
        userAuth,
        validateRequestParams(ParamExistingDeviceUUID),
        async (req: TokenRequest, res: Response, next: NextFunction) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling add existing Shop endpoint endpoint');
            try {
                const attractionId = req.params.attractionId;
                const apartmentId = req.params.apartmentId;

                const attractionFromOwnerServiceInstance = Container.get(
                    AttractionsFromOwnerService
                );

                await attractionFromOwnerServiceInstance.AddExistingAttractionToApartment(
                    ShopApartment,
                    { shopId: attractionId, apartmentId: apartmentId }
                );

                res.status(200).end();
            } catch (e) {
                return next(e);
            }
        }
    );

    route.post(
        '/:shopId/image',
        userAuth,
        uploadImages('public/uploads/shop').array('images'),
        validateRequestParams(ParamShopUUID),
        async (req: TokenRequest, res: Response, next: NextFunction) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling Update Shop image endpoint');
            try {
                const shopServiceInstance = Container.get(ShopService);

                const userID = req.decoded.id;
                const shopId = req.params.shopId;

                const imagesPath: string[] = (
                    req.files as Express.Multer.File[]
                ).map((file: Express.Multer.File) => file.path);

                await shopServiceInstance.UpdateImage(
                    shopId,
                    userID,
                    imagesPath
                );

                res.status(200).end();
            } catch (e) {
                return next(e);
            }
        }
    );

    route.patch(
        '/:shopId',
        userAuth,
        uploadImages('public/uploads/shop').array('images'),
        validateRequestParams(ParamShopUUID),
        validateRequestBody(UpdateShopDTO),
        async (
            req: TokenRequest & {
                body: z.infer<typeof UpdateShopDTO>;
            },
            res: Response,
            next: NextFunction
        ) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling Edit Shop endpoint');

            try {
                const shopId = req.params.shopId;
                const userId = req.decoded.id;
                const {
                    title,
                    description,
                    lat,
                    lng,
                    titleImage,
                    imagesUrlArray,
                } = req.body;

                let imagesPath: string[] | undefined = [];

                if (req.files) {
                    imagesPath = (req.files as Express.Multer.File[]).map(
                        (file: Express.Multer.File) => file.path
                    );

                    if (
                        typeof titleImage === 'number' &&
                        titleImage >= imagesPath.length
                    ) {
                        throw new Error('Invalid titleImage chosen!');
                    }
                }

                const shopServiceInstance = Container.get(ShopService);

                await shopServiceInstance.UpdateShop(
                    title,
                    description,
                    userId,
                    lat,
                    lng,
                    shopId,
                    titleImage,
                    imagesPath,
                    imagesUrlArray
                );

                res.status(200).end();
            } catch (e) {
                return next(e);
            }
        }
    );

    route.get(
        '/:shopId',
        validateRequestParams(ParamShopUUID),
        async (req: TokenRequest, res: Response, next: NextFunction) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling Get Shop endpoint');

            try {
                const shopId = req.params.shopId;

                const shopServiceInstance = Container.get(ShopService);

                const shop = await shopServiceInstance.GetShopById(shopId);

                res.status(200).json(shop);
            } catch (e) {
                return next(e);
            }
        }
    );

    route.get(
        '/:apartmentId/list',
        userAuth,
        validateRequestParams(ParamApartmentUUID),
        async (req: TokenRequest, res: Response, next: NextFunction) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling Get all Shops from owner endpoint');

            try {
                const userID = req.decoded.id;
                const apartmentId = req.params.apartmentId;

                const attractionFromOwnerServiceInstance = Container.get(
                    AttractionsFromOwnerService
                );

                const shops =
                    await attractionFromOwnerServiceInstance.GetAttractionsFromOtherApartments(
                        userID,
                        apartmentId,
                        Shop,
                        'shops',
                        'shopId'
                    );

                res.status(200).json(shops);
            } catch (e) {
                return next(e);
            }
        }
    );

    route.delete(
        '/:apartmentId/:shopId',
        userAuth,
        validateRequestParams(ParamShopUUID),
        async (req: TokenRequest, res: Response, next: NextFunction) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling Delete Shop endpoint');

            try {
                const shopId = req.params.shopId;
                const apartmentId = req.params.apartmentId;
                const userId = req.decoded.id;

                const shopServiceInstance = Container.get(ShopService);

                await shopServiceInstance.DeleteShop(
                    shopId,
                    userId,
                    apartmentId
                );

                res.status(200).end();
            } catch (e) {
                return next(e);
            }
        }
    );
};
