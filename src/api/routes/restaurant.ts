import { TokenRequest, userAuth } from '@api/middlewares/privateRoute';
import { LoggerType } from '@loaders/logger';
import Container from 'typedi';
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
import { uploadImages } from '@utils/functions';
import { ParamApartmentUUID } from '@interfaces/apartment';
import AttractionsFromOwnerService from '@services/attractionsFromOwner';
import { Restaurant } from '@models/restaurant';
import { ParamExistingDeviceUUID } from '@interfaces/device';
import { RestaurantApartment } from '@models/restaurantApartment';

const route = Router();

export default (app: Router) => {
    app.use('/restaurant', route);

    route.post(
        '/new',
        userAuth,
        uploadImages('public/uploads/restaurant').array('images'),
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
        '/:attractionId/existing/:apartmentId',
        userAuth,
        validateRequestParams(ParamExistingDeviceUUID),
        async (req: TokenRequest, res: Response, next: NextFunction) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling add existing Restaurant endpoint endpoint');
            try {
                const attractionId = req.params.attractionId;
                const apartmentId = req.params.apartmentId;

                const attractionFromOwnerServiceInstance = Container.get(
                    AttractionsFromOwnerService
                );

                await attractionFromOwnerServiceInstance.AddExistingAttractionToApartment(
                    RestaurantApartment,
                    { restaurantId: attractionId, apartmentId: apartmentId }
                );

                res.status(200).end();
            } catch (e) {
                return next(e);
            }
        }
    );

    route.get(
        '/:restaurantId',
        validateRequestParams(ParamRestaurantUUID),
        async (req: TokenRequest, res: Response, next: NextFunction) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling Get Beach endpoint');

            try {
                const restaurantId = req.params.restaurantId;

                const restaurantServiceInstance =
                    Container.get(RestaurantService);

                const restaurant =
                    await restaurantServiceInstance.GetRestaurantById(
                        restaurantId
                    );

                res.status(200).json(restaurant);
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
            Logger.debug('Calling Get all Restaurants from owner endpoint');

            try {
                const userID = req.decoded.id;
                const apartmentId = req.params.apartmentId;

                const attractionFromOwnerServiceInstance = Container.get(
                    AttractionsFromOwnerService
                );

                const restaurants =
                    await attractionFromOwnerServiceInstance.GetAttractionsFromOtherApartments(
                        userID,
                        apartmentId,
                        Restaurant,
                        'restaurants',
                        'restaurantId'
                    );

                res.status(200).json(restaurants);
            } catch (e) {
                return next(e);
            }
        }
    );

    route.post(
        '/:restaurantId/image',
        userAuth,
        uploadImages('public/uploads/restaurant').array('images'),
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
        uploadImages('public/uploads/restaurant').array('images'),
        validateRequestParams(ParamRestaurantUUID),
        validateRequestBody(UpdateRestaurantDTO),
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

    route.delete(
        '/:apartmentId/:restaurantId',
        userAuth,
        validateRequestParams(ParamRestaurantUUID),
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
