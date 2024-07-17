import multer from 'multer';
import { TokenRequest, userAuth } from '@api/middlewares/privateRoute';
import { LoggerType } from '@loaders/logger';
import Container from 'typedi';
import { ImageUrlDTO } from '@interfaces/shop';
import { Router, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
    validateRequestBody,
    validateRequestParams,
    validateRequestQuery,
} from 'zod-express-middleware';
import {
    NewRestaurantDTO,
    ParamRestaurantUUID,
    UpdateRestaurantDTO,
} from '@interfaces/restaurant';
import RestaurantService from '@services/restaurant';

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
    dest: 'public/uploads/restaurant',
    limits: {
        fileSize: 1024 * 1024 * 5, // 5 MB
    },
    fileFilter,
}); // Set up multer for uploading

export default (app: Router) => {
    app.use('/restaurant', route);

    route.post(
        '/new',
        userAuth,
        upload.array('images'),
        validateRequestBody(NewRestaurantDTO),
        async (
            req: TokenRequest & {
                body: z.infer<typeof NewRestaurantDTO>;
            },
            res: Response,
            next: NextFunction
        ) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling New Restaurant endpoint');
            console.log(req.body);
            try {
                const userID = req.decoded.id;
                const restaurantServiceInstance =
                    Container.get(RestaurantService);
                const {
                    title,
                    description,
                    apartmentId,
                    lat,
                    lng,
                    emailContact,
                    phoneContact,
                    review,
                    reviewAmount,
                    titleImage,
                } = req.body;

                const imagesPath: string[] = (
                    req.files as Express.Multer.File[]
                ).map((file: Express.Multer.File) => file.path);

                if (titleImage >= imagesPath.length) {
                    throw new Error('Invalid titleImage chosen!');
                }

                const restaurantId =
                    await restaurantServiceInstance.CreateRestaurant(
                        title,
                        description,
                        apartmentId,
                        lat,
                        lng,
                        emailContact,
                        phoneContact,
                        review,
                        reviewAmount,
                        imagesPath,
                        imagesPath[titleImage],
                        userID
                    );

                res.status(200).json({ restaurantId });
            } catch (e) {
                return next(e);
            }
        }
    );

    route.post(
        '/:restaurantId/image',
        userAuth,
        upload.array('image'),
        validateRequestParams(ParamRestaurantUUID),
        async (req: TokenRequest, res: Response, next: NextFunction) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling Update Restaurant image endpoint');
            try {
                const restaurantServiceInstance =
                    Container.get(RestaurantService);

                const userID = req.decoded.id;
                const restaurantId = req.params.restaurantId;

                const imagesPath: string[] = (
                    req.files as Express.Multer.File[]
                ).map((file: Express.Multer.File) => file.path);

                await restaurantServiceInstance.UpdateImage(
                    restaurantId,
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
        '/:restaurantId',
        userAuth,
        validateRequestBody(UpdateRestaurantDTO),
        validateRequestParams(ParamRestaurantUUID),
        async (
            req: TokenRequest & {
                body: z.infer<typeof UpdateRestaurantDTO>;
            },
            res: Response,
            next: NextFunction
        ) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling Edit Restaurant endpoint');

            try {
                const restaurantId = req.params.restaurantId;
                const userId = req.decoded.id;
                const {
                    title,
                    description,
                    lat,
                    lng,
                    emailContact,
                    phoneContact,
                    review,
                    reviewAmount,
                    titleImage,
                } = req.body;

                const restaurantServiceInstance =
                    Container.get(RestaurantService);

                await restaurantServiceInstance.UpdateRestaurant(
                    title,
                    description,
                    userId,
                    lat,
                    lng,
                    emailContact,
                    phoneContact,
                    review,
                    reviewAmount,
                    restaurantId,
                    titleImage
                );

                res.status(200).end();
            } catch (e) {
                return next(e);
            }
        }
    );

    route.delete(
        '/image/:restaurantId',
        userAuth,
        validateRequestBody(ImageUrlDTO),
        validateRequestParams(ParamRestaurantUUID),
        async (
            req: TokenRequest & {
                body: z.infer<typeof ImageUrlDTO>;
            },
            res: Response,
            next: NextFunction
        ) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling Delete Restaurant endpoint');

            try {
                const restaurantId = req.params.restaurantId;
                const userId = req.decoded.id;
                const { imageUrl } = req.body;

                const restaurantServiceInstance =
                    Container.get(RestaurantService);

                await restaurantServiceInstance.DeleteImage(
                    restaurantId,
                    userId,
                    imageUrl
                );

                res.status(200).end();
            } catch (e) {
                return next(e);
            }
        }
    );

    route.delete(
        '/:apartmentId/:restaurantId',
        userAuth,
        validateRequestQuery(ParamRestaurantUUID),
        async (req: TokenRequest, res: Response, next: NextFunction) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling Delete Restaurant endpoint');

            try {
                const restaurantId = req.params.restaurantId;
                const apartmentId = req.params.apartmentId;
                const userId = req.decoded.id;

                const restaurantServiceInstance =
                    Container.get(RestaurantService);

                await restaurantServiceInstance.DeleteRestaurant(
                    restaurantId,
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
