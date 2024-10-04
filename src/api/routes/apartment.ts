import {TokenRequest, userAuth} from '@api/middlewares/privateRoute';
import {LoggerType} from '@loaders/logger';
import Container from 'typedi';
import {Router, Response, NextFunction} from 'express';
import {z} from 'zod';
import {
    validateRequestBody,
    validateRequestParams,
} from 'zod-express-middleware';
import ApartmentService from '@services/apartment';
import {
    NewAboutUsDTO,
    NewApartmentDTO,
    ParamApartmentUUID,
    UpdateAboutUsDTO,
} from '@interfaces/apartment';
import {uploadImages} from '@utils/functions';
import ReviewService from '@services/review';
import * as console from "node:console";

const route = Router();

export default (app: Router): void => {
    app.use('/apartment', route);

    route.get(
        '/list',
        userAuth,
        async (req: TokenRequest, res: Response, next: NextFunction) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling Get all apartments endpoint');

            try {
                const userId = req.decoded.id;

                const apartmentServiceInstance =
                    Container.get(ApartmentService);

                const apartments =
                    await apartmentServiceInstance.GetAllUserApartments(userId);

                res.status(200).json({apartments});
            } catch (e) {
                return next(e);
            }
        }
    );
    route.get(
        '/:apartmentId/info',
        async (req: TokenRequest, res: Response, next: NextFunction) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling Get apartment info endpoint');

            try {
                const apartmentId = req.params.apartmentId;

                const apartmentServiceInstance =
                    Container.get(ApartmentService);

                const apartment =
                    await apartmentServiceInstance.GetApartmentInfo(
                        apartmentId
                    );

                res.status(200).json(apartment);
            } catch (e) {
                return next(e);
            }
        }
    );

    route.get(
        '/:apartmentId/beaches',
        validateRequestParams(ParamApartmentUUID),
        async (req: TokenRequest, res: Response, next: NextFunction) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling Get all Beaches in apartment endpoint');

            try {
                const apartmentId = req.params.apartmentId;

                const apartmentServiceInstance =
                    Container.get(ApartmentService);

                const beaches =
                    await apartmentServiceInstance.GetAllBeachesInApartment(
                        apartmentId
                    );

                res.status(200).json(beaches);
            } catch (e) {
                return next(e);
            }
        }
    );

    route.get(
        '/:apartmentId/reservations',
        validateRequestParams(ParamApartmentUUID),
        async (req: TokenRequest, res: Response, next: NextFunction) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling Get all reservations in apartment endpoint');

            try {
                const apartmentId = req.params.apartmentId;

                const apartmentServiceInstance =
                    Container.get(ApartmentService);

                const reservations =
                    await apartmentServiceInstance.GetReservationByApartment(
                        apartmentId
                    );

                res.status(200).json(reservations);
            } catch (e) {
                return next(e);
            }
        }
    );
    route.get(
        '/:apartmentId/current-reservation',
        validateRequestParams(ParamApartmentUUID),
        async (req: TokenRequest, res: Response, next: NextFunction) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug(
                'Calling Get current reservation for apartment endpoint'
            );

            try {
                const apartmentId = req.params.apartmentId;

                const apartmentServiceInstance =
                    Container.get(ApartmentService);

                const currentReservation =
                    await apartmentServiceInstance.GetCurrentReservationForApartment(
                        apartmentId
                    );

                res.status(200).json(currentReservation);
            } catch (e) {
                return next(e);
            }
        }
    );

    route.get(
        '/:apartmentId/sights',
        validateRequestParams(ParamApartmentUUID),
        async (req: TokenRequest, res: Response, next: NextFunction) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling Get all Sights in apartment endpoint');

            try {
                const apartmentId = req.params.apartmentId;

                const apartmentServiceInstance =
                    Container.get(ApartmentService);

                const sights =
                    await apartmentServiceInstance.GetAllSightsInApartment(
                        apartmentId
                    );

                res.status(200).json(sights);
            } catch (e) {
                return next(e);
            }
        }
    );
    route.get(
        '/:apartmentId/devices',
        validateRequestParams(ParamApartmentUUID),
        async (req: TokenRequest, res: Response, next: NextFunction) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling Get all Devices in apartment endpoint');

            try {
                const apartmentId = req.params.apartmentId;

                const apartmentServiceInstance =
                    Container.get(ApartmentService);

                const devices =
                    await apartmentServiceInstance.GetAllDevicesInApartment(
                        apartmentId
                    );

                res.status(200).json(devices);
            } catch (e) {
                return next(e);
            }
        }
    );

    route.get(
        '/:apartmentId/aboutUs',
        validateRequestParams(ParamApartmentUUID),
        async (req: TokenRequest, res: Response, next: NextFunction) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling Get about us for apartment endpoint');

            try {
                const apartmentId = req.params.apartmentId;

                const apartmentServiceInstance =
                    Container.get(ApartmentService);

                const aboutUs =
                    await apartmentServiceInstance.GetAboutUs(apartmentId);

                res.status(200).json(aboutUs);
            } catch (e) {
                return next(e);
            }
        }
    );
    route.post(
        '/aboutUs',
        userAuth,
        uploadImages('public/uploads/aboutUs').array('images'),
        validateRequestBody(NewAboutUsDTO),
        async (req: TokenRequest, res: Response, next: NextFunction) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling add about us for apartment endpoint');

            try {
                const {moto, aboutUs, titleImage, apartmentId} = req.body;

                const imagesPath: string[] = (
                    req.files as Express.Multer.File[]
                ).map((file: Express.Multer.File) => file.path);

                if (titleImage >= imagesPath.length) {
                    throw new Error('Invalid titleImage chosen!');
                }

                const apartmentServiceInstance =
                    Container.get(ApartmentService);

                await apartmentServiceInstance.CreateAboutUs(
                    apartmentId,
                    moto,
                    aboutUs,
                    imagesPath,
                    imagesPath[titleImage]
                );

                res.status(200);
            } catch (e) {
                return next(e);
            }
        }
    );
    route.patch(
        '/:apartmentId/aboutUs',
        userAuth,
        uploadImages('public/uploads/aboutUs').array('images'),
        validateRequestParams(ParamApartmentUUID),
        validateRequestBody(UpdateAboutUsDTO),
        async (req: TokenRequest, res: Response, next: NextFunction) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling edit about us for apartment endpoint');

            try {
                const apartmentId = req.params.apartmentId;
                const {moto, aboutUs, titleImage, imagesUrlArray} = req.body;
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

                const apartmentServiceInstance =
                    Container.get(ApartmentService);

                await apartmentServiceInstance.UpdateAboutUs(
                    apartmentId,
                    moto,
                    aboutUs,
                    imagesPath,
                    titleImage,
                    imagesUrlArray
                );

                res.status(200);
            } catch (e) {
                return next(e);
            }
        }
    );
    route.get(
        '/:apartmentId/shops',
        validateRequestParams(ParamApartmentUUID),
        async (req: TokenRequest, res: Response, next: NextFunction) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling Get all Shops in apartment endpoint');

            try {
                const apartmentId = req.params.apartmentId;

                const apartmentServiceInstance =
                    Container.get(ApartmentService);

                const shops =
                    await apartmentServiceInstance.GetAllShopsInApartment(
                        apartmentId
                    );

                res.status(200).json(shops);
            } catch (e) {
                return next(e);
            }
        }
    );

    route.get(
        '/:apartmentId/restaurants',
        validateRequestParams(ParamApartmentUUID),
        async (req: TokenRequest, res: Response, next: NextFunction) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling Get all Restaurants in apartment endpoint');

            try {
                const apartmentId = req.params.apartmentId;

                const apartmentServiceInstance =
                    Container.get(ApartmentService);

                const restaurants =
                    await apartmentServiceInstance.GetAllRestaurantsInApartment(
                        apartmentId
                    );

                res.status(200).json(restaurants);
            } catch (e) {
                return next(e);
            }
        }
    );
    route.get(
        '/:apartmentId/reviews',
        validateRequestParams(ParamApartmentUUID),
        async (req: TokenRequest, res: Response, next: NextFunction) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling Get all reviews for apartment endpoint');

            try {
                const apartmentId = req.params.apartmentId;

                const apartmentServiceInstance =
                    Container.get(ApartmentService);

                const reviews =
                    await apartmentServiceInstance.GetAllReviewsForApartment(
                        apartmentId
                    );

                res.status(200).json({...reviews});
            } catch (e) {
                return next(e);
            }
        }
    );

    route.post(
        '/new',
        userAuth,
        validateRequestBody(NewApartmentDTO),
        async (
            req: TokenRequest & {
                body: z.infer<typeof NewApartmentDTO>;
            },
            res: Response,
            next: NextFunction
        ) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling New Apartment endpoint');
            try {
                const apartmentServiceInstance =
                    Container.get(ApartmentService);
                const {name, lat, lng, address, apartmentPassword} = req.body;
                const userId = req.decoded.id;

                const apartmentId =
                    await apartmentServiceInstance.CreateApartment(
                        name,
                        lat,
                        lng,
                        address,
                        userId,
                        apartmentPassword
                    );

                res.status(200).json({apartmentId});
            } catch (e) {
                return next(e);
            }
        }
    );

    route.patch(
        '/:apartmentId',
        userAuth,
        validateRequestBody(NewApartmentDTO),
        validateRequestParams(ParamApartmentUUID),
        async (
            req: TokenRequest & {
                body: z.infer<typeof NewApartmentDTO>;
            },
            res: Response,
            next: NextFunction
        ) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling update Apartment endpoint');
            try {
                const apartmentServiceInstance =
                    Container.get(ApartmentService);
                const {name, lat, lng, address, apartmentPassword} = req.body;
                const apartmentId = req.params.apartmentId;

                await apartmentServiceInstance.UpdateApartment(
                    name,
                    lat,
                    lng,
                    address,
                    apartmentId,
                    apartmentPassword
                );

                res.status(200).end();
            } catch (e) {
                return next(e);
            }
        }
    );
};
