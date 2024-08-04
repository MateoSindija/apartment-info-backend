import { TokenRequest, userAuth } from '@api/middlewares/privateRoute';
import { LoggerType } from '@loaders/logger';
import Container from 'typedi';
import { ImageUrlDTO } from '@interfaces/shop';
import { Router, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
    validateRequestBody,
    validateRequestParams,
} from 'zod-express-middleware';
import { NewSightDTO, ParamSightUUID, UpdateSightDTO } from '@interfaces/sight';
import SightService from '@services/sights';
import { uploadImages } from '@utils/functions';
import { ParamApartmentUUID } from '@interfaces/apartment';
import AttractionsFromOwnerService from '@services/attractionsFromOwner';
import { Sight } from '@models/sight';
import { ParamExistingDeviceUUID } from '@interfaces/device';
import { SightApartment } from '@models/sightApartment';

const route = Router();

export default (app: Router) => {
    app.use('/sight', route);

    route.post(
        '/new',
        userAuth,
        uploadImages('public/uploads/sight').array('images'),
        validateRequestBody(NewSightDTO),
        async (
            req: TokenRequest & {
                body: z.infer<typeof NewSightDTO>;
            },
            res: Response,
            next: NextFunction
        ) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling New Sight endpoint');
            try {
                const userId = req.decoded.id;
                const sightServiceInstance = Container.get(SightService);
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

                const sightId = await sightServiceInstance.CreateSight(
                    title,
                    description,
                    apartmentId,
                    lat,
                    lng,
                    imagesPath,
                    imagesPath[titleImage],
                    userId
                );

                res.status(200).json({ sightId });
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
            Logger.debug('Calling add existing Sight endpoint endpoint');
            try {
                const attractionId = req.params.attractionId;
                const apartmentId = req.params.apartmentId;

                const attractionFromOwnerServiceInstance = Container.get(
                    AttractionsFromOwnerService
                );

                await attractionFromOwnerServiceInstance.AddExistingAttractionToApartment(
                    SightApartment,
                    { sightId: attractionId, apartmentId: apartmentId }
                );

                res.status(200).end();
            } catch (e) {
                return next(e);
            }
        }
    );

    route.post(
        '/:sightId/image',
        userAuth,
        uploadImages('public/uploads/sight').array('images'),
        validateRequestParams(ParamSightUUID),
        async (req: TokenRequest, res: Response, next: NextFunction) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling Update Sight image endpoint');
            try {
                const sightServiceInstance = Container.get(SightService);

                const userID = req.decoded.id;
                const sightId = req.params.sightId;

                const imagesPath: string[] = (
                    req.files as Express.Multer.File[]
                ).map((file: Express.Multer.File) => file.path);

                await sightServiceInstance.UpdateImage(
                    sightId,
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
        '/:sightId',
        userAuth,
        uploadImages('public/uploads/sight').array('images'),
        validateRequestParams(ParamSightUUID),
        validateRequestBody(UpdateSightDTO),
        async (
            req: TokenRequest & {
                body: z.infer<typeof UpdateSightDTO>;
            },
            res: Response,
            next: NextFunction
        ) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling Edit Sight endpoint');

            try {
                const sightId = req.params.sightId;
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

                const sightServiceInstance = Container.get(SightService);

                await sightServiceInstance.UpdateSight(
                    title,
                    description,
                    userId,
                    lat,
                    lng,
                    sightId,
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
        '/:sightId',
        validateRequestParams(ParamSightUUID),
        async (req: TokenRequest, res: Response, next: NextFunction) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling Get Sight endpoint');

            try {
                const sightId = req.params.sightId;

                const sightServiceInstance = Container.get(SightService);

                const sight = await sightServiceInstance.GetSightById(sightId);

                res.status(200).json(sight);
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
            Logger.debug('Calling Get all Sights from owner endpoint');

            try {
                const userID = req.decoded.id;
                const apartmentId = req.params.apartmentId;

                const attractionFromOwnerServiceInstance = Container.get(
                    AttractionsFromOwnerService
                );

                const sights =
                    await attractionFromOwnerServiceInstance.GetAttractionsFromOtherApartments(
                        userID,
                        apartmentId,
                        Sight,
                        'sights',
                        'sightId'
                    );

                res.status(200).json(sights);
            } catch (e) {
                return next(e);
            }
        }
    );

    route.delete(
        '/image/:sightId',
        userAuth,
        validateRequestBody(ImageUrlDTO),
        validateRequestParams(ParamSightUUID),
        async (
            req: TokenRequest & {
                body: z.infer<typeof ImageUrlDTO>;
            },
            res: Response,
            next: NextFunction
        ) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling Delete Sight image endpoint');

            try {
                const sightId = req.params.sightId;
                const userId = req.decoded.id;
                const { imageUrl } = req.body;

                const sightServiceInstance = Container.get(SightService);

                await sightServiceInstance.DeleteImage(
                    sightId,
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
        '/:apartmentId/:sightId',
        userAuth,
        validateRequestParams(ParamSightUUID),
        async (req: TokenRequest, res: Response, next: NextFunction) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling Delete Sight endpoint');

            try {
                const sightId = req.params.sightId;
                const apartmentId = req.params.apartmentId;
                const userId = req.decoded.id;

                const sightServiceInstance = Container.get(SightService);

                await sightServiceInstance.DeleteSight(
                    sightId,
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
