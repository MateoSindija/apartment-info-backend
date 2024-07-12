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
} from 'zod-express-middleware';
import { NewSightDTO, ParamSightUUID, UpdateSightDTO } from '@interfaces/sight';
import SightService from '@services/sights';

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
    dest: 'public/uploads/sight',
    limits: {
        fileSize: 1024 * 1024 * 5, // 5 MB
    },
    fileFilter,
}); // Set up multer for uploading

export default (app: Router) => {
    app.use('/sight', route);

    route.post(
        '/new',
        userAuth,
        upload.array('images'),
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
        '/:sightId/image',
        userAuth,
        upload.array('image'),
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
        validateRequestBody(UpdateSightDTO),
        validateRequestParams(ParamSightUUID),
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
                const { title, description, lat, lng, titleImage } = req.body;

                const sightServiceInstance = Container.get(SightService);

                await sightServiceInstance.UpdateSight(
                    title,
                    description,
                    userId,
                    lat,
                    lng,
                    sightId,
                    titleImage
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

                res.status(200).json({ sight });
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
