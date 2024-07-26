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
    NewReservationDTO,
    ReservationParamsUUID,
    UpdateReservationDTO,
} from '@interfaces/reservation';
import ReservationService from '@services/reservation';

const route = Router();

export default (app: Router) => {
    app.use('/reservation', route);

    route.post(
        '/new',
        userAuth,
        validateRequestBody(NewReservationDTO),
        async (
            req: TokenRequest & {
                body: z.infer<typeof NewReservationDTO>;
            },
            res: Response,
            next: NextFunction
        ) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling Create Reservation period endpoint');
            try {
                const userId = req.decoded.id;
                const reservationServiceInstance =
                    Container.get(ReservationService);
                const { startDate, endDate, apartmentId, clientName } =
                    req.body;
                const reservationId =
                    await reservationServiceInstance.CreateReservation(
                        apartmentId,
                        userId,
                        startDate,
                        endDate,
                        clientName
                    );

                res.status(200).json({ reservationId });
            } catch (e) {
                return next(e);
            }
        }
    );

    route.get(
        '/:reservationId',
        userAuth,
        validateRequestParams(ReservationParamsUUID),
        async (req: TokenRequest, res: Response, next: NextFunction) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling Get Reservation by id endpoint');
            try {
                const reservationId = req.params.reservationId;

                const reservationServiceInstance =
                    Container.get(ReservationService);

                const reservation =
                    await reservationServiceInstance.GetReservation(
                        reservationId
                    );

                res.status(200).json(reservation);
            } catch (e) {
                return next(e);
            }
        }
    );

    route.patch(
        '/:reservationId',
        userAuth,
        validateRequestBody(UpdateReservationDTO),
        validateRequestParams(ReservationParamsUUID),
        async (
            req: TokenRequest & {
                body: z.infer<typeof UpdateReservationDTO>;
            },
            res: Response,
            next: NextFunction
        ) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling Edit Reservation endpoint');

            try {
                const reservationId = req.params.reservationId;
                const userId = req.decoded.id;
                const { startDate, endDate, clientName, apartmentId } =
                    req.body;

                const reservationServiceInstance =
                    Container.get(ReservationService);

                await reservationServiceInstance.UpdateReservation(
                    reservationId,
                    apartmentId,
                    userId,
                    startDate,
                    endDate,
                    clientName
                );

                res.status(200).end();
            } catch (e) {
                return next(e);
            }
        }
    );

    route.delete(
        '/:reservationId',
        userAuth,
        validateRequestParams(ReservationParamsUUID),
        async (req: TokenRequest, res: Response, next: NextFunction) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling Delete Reservation endpoint');

            try {
                const reservationId = req.params.reservationId;
                const userId = req.decoded.id;

                const reservationServiceInstance =
                    Container.get(ReservationService);

                await reservationServiceInstance.DeleteReservation(
                    reservationId,
                    userId
                );

                res.status(200).end();
            } catch (e) {
                return next(e);
            }
        }
    );
};
