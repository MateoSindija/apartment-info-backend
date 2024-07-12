import { TokenRequest, userAuth } from '@api/middlewares/privateRoute';
import { LoggerType } from '@loaders/logger';
import Container from 'typedi';
import { Router, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
    validateRequestBody,
    validateRequestParams,
} from 'zod-express-middleware';
import ApartmentService from '@services/apartment';
import { NewApartmentDTO, ParamApartmentUUID } from '@interfaces/apartment';

const route = Router();

export default (app: Router): void => {
    app.use('/apartment', route);

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

                res.status(200).json({ beaches });
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

                res.status(200).json({ sights });
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

                res.status(200).json({ devices });
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

                res.status(200).json({ shops });
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

                res.status(200).json({ restaurants });
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

                res.status(200).json({ reviews });
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
                const { name, description, organizationId, lat, lng, address } =
                    req.body;

                const apartmentId =
                    await apartmentServiceInstance.CreateApartment(
                        name,
                        description,
                        lat,
                        lng,
                        address,
                        organizationId
                    );

                res.status(200).json({ apartmentId });
            } catch (e) {
                return next(e);
            }
        }
    );
};
