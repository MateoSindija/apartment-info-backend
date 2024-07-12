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
import { NewBeachDTO, ParamBeachUUID, UpdateBeachDTO } from '@interfaces/beach';
import BeachService from '@services/beach';

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
    dest: 'public/uploads/beach',
    limits: {
        fileSize: 1024 * 1024 * 5, // 5 MB
    },
    fileFilter,
}); // Set up multer for uploading

export default (app: Router) => {
    app.use('/beach', route);

    route.post(
        '/new',
        userAuth,
        upload.array('images'),
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
        upload.array('image'),
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

                res.status(200).json({ beach });
            } catch (e) {
                return next(e);
            }
        }
    );

    route.patch(
        '/:beachId',
        userAuth,
        validateRequestBody(UpdateBeachDTO),
        validateRequestParams(ParamBeachUUID),
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
                } = req.body;

                const beachServiceInstance = Container.get(BeachService);

                await beachServiceInstance.UpdateBeach(
                    title,
                    description,
                    userId,
                    lat,
                    lng,
                    terrainType,
                    beachId,
                    titleImage
                );

                res.status(200).end();
            } catch (e) {
                return next(e);
            }
        }
    );

    route.delete(
        '/image/:beachId',
        userAuth,
        validateRequestBody(ImageUrlDTO),
        validateRequestParams(ParamBeachUUID),
        async (
            req: TokenRequest & {
                body: z.infer<typeof ImageUrlDTO>;
            },
            res: Response,
            next: NextFunction
        ) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling Delete Image endpoint');

            try {
                const beachId = req.params.beachId;
                const userId = req.decoded.id;
                const { imageUrl } = req.body;

                const beachServiceInstance = Container.get(BeachService);

                await beachServiceInstance.DeleteImage(
                    beachId,
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
