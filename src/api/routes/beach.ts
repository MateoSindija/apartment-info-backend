import { TokenRequest, userAuth } from '@api/middlewares/privateRoute';
import { LoggerType } from '@loaders/logger';
import Container from 'typedi';
import { Router, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
    validateRequestBody,
    validateRequestParams,
} from 'zod-express-middleware';
import { NewBeachDTO, ParamBeachUUID, UpdateBeachDTO } from '@interfaces/beach';
import BeachService from '@services/beach';
import { uploadImages } from '@utils/functions';

const route = Router();

export default (app: Router) => {
    app.use('/beach', route);

    route.post(
        '/new',
        userAuth,
        uploadImages('public/uploads/beach').array('images'),
        validateRequestBody(NewBeachDTO),
        async (
            req: TokenRequest & {
                body: z.infer<typeof NewBeachDTO>;
            },
            res: Response,
            next: NextFunction
        ) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling New Beach endpoint');
            const userID = req.decoded.id;

            try {
                const beachServiceInstance = Container.get(BeachService);
                const {
                    title,
                    description,
                    apartmentId,
                    lat,
                    lng,
                    titleImage,
                    terrainType,
                } = req.body;

                const imagesPath: string[] = (
                    req.files as Express.Multer.File[]
                ).map((file: Express.Multer.File) => file.path);

                if (titleImage >= imagesPath.length) {
                    throw new Error('Invalid titleImage chosen!');
                }

                const shopId = await beachServiceInstance.CreateBeach(
                    title,
                    description,
                    apartmentId,
                    lat,
                    lng,
                    userID,
                    terrainType,
                    imagesPath,
                    imagesPath[titleImage]
                );

                res.status(200).json({ shopId });
            } catch (e) {
                return next(e);
            }
        }
    );

    route.post(
        '/:beachId/image',
        userAuth,
        uploadImages('public/uploads/beach').array('images'),
        validateRequestParams(ParamBeachUUID),
        async (req: TokenRequest, res: Response, next: NextFunction) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling Update Beach image endpoint');
            try {
                const beachServiceInstance = Container.get(BeachService);

                const userID = req.decoded.id;
                const shopId = req.params.beachId;

                const imagesPath: string[] = (
                    req.files as Express.Multer.File[]
                ).map((file: Express.Multer.File) => file.path);

                await beachServiceInstance.UpdateImage(
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

    route.get(
        '/:beachId',
        validateRequestParams(ParamBeachUUID),
        async (req: TokenRequest, res: Response, next: NextFunction) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling Get Beach endpoint');

            try {
                const beachId = req.params.beachId;

                const beachServiceInstance = Container.get(BeachService);

                const beach = await beachServiceInstance.GetBeachById(beachId);

                res.status(200).json(beach);
            } catch (e) {
                return next(e);
            }
        }
    );

    route.patch(
        '/:beachId',
        userAuth,
        uploadImages('public/uploads/beach').array('images'),
        validateRequestParams(ParamBeachUUID),
        validateRequestBody(UpdateBeachDTO),
        async (
            req: TokenRequest & {
                body: z.infer<typeof UpdateBeachDTO>;
            },
            res: Response,
            next: NextFunction
        ) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling Edit Beach endpoint');

            try {
                const beachId = req.params.beachId;
                const userId = req.decoded.id;
                const {
                    title,
                    description,
                    lat,
                    lng,
                    titleImage,
                    terrainType,
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

                const beachServiceInstance = Container.get(BeachService);

                await beachServiceInstance.UpdateBeach(
                    title,
                    description,
                    userId,
                    lat,
                    lng,
                    terrainType,
                    beachId,
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
        '/:apartmentId/:beachId',
        userAuth,
        validateRequestParams(ParamBeachUUID),
        async (req: TokenRequest, res: Response, next: NextFunction) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling Delete Beach endpoint');

            try {
                const beachId = req.params.beachId;
                const apartmentId = req.params.apartmentId;
                const userId = req.decoded.id;

                const beachServiceInstance = Container.get(BeachService);

                await beachServiceInstance.DeleteBeach(
                    beachId,
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
