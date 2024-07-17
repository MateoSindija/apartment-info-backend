import multer from 'multer';
import { TokenRequest, userAuth } from '@api/middlewares/privateRoute';
import { LoggerType } from '@loaders/logger';
import Container from 'typedi';
import {
    ImageUrlDTO,
    NewShopDTO,
    ParamShopUUID,
    UpdateShopDTO,
} from '@interfaces/shop';
import ShopService from '@services/shop';
import { Router, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
    validateRequestBody,
    validateRequestParams,
} from 'zod-express-middleware';
const route = Router();

const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/webp'
    ) {
        // If the image is either JPEG, PNG, WEBP or JPG
        cb(null, true); // Allow the image
    } else {
        cb(
            'Unsupported file extension. The image must be in JPEG or PNG format.',
            false
        ); // Reject the image
    }
};

const upload = multer({
    dest: 'public/uploads/shop',
    limits: {
        fileSize: 1024 * 1024 * 5, // 5 MB
    },
    fileFilter,
}); // Set up multer for uploading

export default (app: Router) => {
    app.use('/shop', route);

    route.post(
        '/new',
        userAuth,
        upload.array('images'),
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
        '/:shopId/image',
        userAuth,
        upload.array('image'),
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
        validateRequestBody(UpdateShopDTO),
        validateRequestParams(ParamShopUUID),
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
                const { title, description, lat, lng, titleImage } = req.body;

                const shopServiceInstance = Container.get(ShopService);

                await shopServiceInstance.UpdateShop(
                    title,
                    description,
                    userId,
                    lat,
                    lng,
                    shopId,
                    titleImage
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

    route.delete(
        '/image/:shopId',
        userAuth,
        validateRequestBody(ImageUrlDTO),
        validateRequestParams(ParamShopUUID),
        async (
            req: TokenRequest & {
                body: z.infer<typeof ImageUrlDTO>;
            },
            res: Response,
            next: NextFunction
        ) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling Delete Shop Image endpoint');

            try {
                const shopId = req.params.shopId;
                const userId = req.decoded.id;
                const { imageUrl } = req.body;

                const shopServiceInstance = Container.get(ShopService);

                await shopServiceInstance.DeleteImage(shopId, userId, imageUrl);

                res.status(200).end();
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
