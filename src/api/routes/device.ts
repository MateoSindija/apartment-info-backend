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
import { NewDeviceDTO, ParamDeviceUUID } from '@interfaces/device';
import DeviceService from '@services/device';
import { UpdateBeachDTO } from '@interfaces/beach';

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
    dest: 'public/uploads/device',
    limits: {
        fileSize: 1024 * 1024 * 5, // 5 MB
    },
    fileFilter,
}); // Set up multer for uploading

export default (app: Router) => {
    app.use('/device', route);

    route.post(
        '/new',
        userAuth,
        upload.array('images'),
        validateRequestBody(NewDeviceDTO),
        async (
            req: TokenRequest & {
                body: z.infer<typeof NewDeviceDTO>;
            },
            res: Response,
            next: NextFunction
        ) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling New Device endpoint');
            try {
                const deviceServiceInstance = Container.get(DeviceService);
                const {
                    title,
                    description,
                    imagesUrl,
                    apartmentId,
                    titleImage,
                } = req.body;

                const imagesPath: string[] = (
                    req.files as Express.Multer.File[]
                ).map((file: Express.Multer.File) => file.path);

                if (titleImage >= imagesPath.length) {
                    throw new Error('Invalid titleImage chosen!');
                }

                const deviceId = await deviceServiceInstance.CreateDevice(
                    title,
                    description,
                    imagesUrl,
                    apartmentId,
                    imagesPath[titleImage]
                );

                res.status(200).json({ deviceId });
            } catch (e) {
                return next(e);
            }
        }
    );

    route.post(
        '/:deviceId/image',
        userAuth,
        upload.array('image'),
        validateRequestParams(ParamDeviceUUID),
        async (req: TokenRequest, res: Response, next: NextFunction) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling Update Device image endpoint');
            try {
                const deviceServiceInstance = Container.get(DeviceService);

                const userID = req.decoded.id;
                const deviceId = req.params.deviceId;

                const imagesPath: string[] = (
                    req.files as Express.Multer.File[]
                ).map((file: Express.Multer.File) => file.path);

                await deviceServiceInstance.UpdateImage(
                    deviceId,
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
        '/:deviceId',
        validateRequestParams(ParamDeviceUUID),
        async (req: TokenRequest, res: Response, next: NextFunction) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling Get Device endpoint');

            try {
                const deviceId = req.params.deviceId;

                const deviceServiceInstance = Container.get(DeviceService);

                const device =
                    await deviceServiceInstance.GetDeviceById(deviceId);

                res.status(200).json({ device });
            } catch (e) {
                return next(e);
            }
        }
    );

    route.patch(
        '/:deviceId',
        userAuth,
        validateRequestBody(UpdateBeachDTO),
        validateRequestParams(ParamDeviceUUID),
        async (
            req: TokenRequest & {
                body: z.infer<typeof UpdateBeachDTO>;
            },
            res: Response,
            next: NextFunction
        ) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling Edit Device endpoint');

            try {
                const deviceId = req.params.deviceId;
                const userId = req.decoded.id;
                const { title, description, titleImage } = req.body;

                const deviceServiceInstance = Container.get(DeviceService);

                await deviceServiceInstance.UpdateDevice(
                    title,
                    description,
                    deviceId,
                    titleImage,
                    userId
                );

                res.status(200).end();
            } catch (e) {
                return next(e);
            }
        }
    );

    route.delete(
        '/image/:deviceId',
        userAuth,
        validateRequestBody(ImageUrlDTO),
        validateRequestParams(ParamDeviceUUID),
        async (
            req: TokenRequest & {
                body: z.infer<typeof ImageUrlDTO>;
            },
            res: Response,
            next: NextFunction
        ) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling Delete Device Image endpoint');

            try {
                const deviceId = req.params.deviceId;
                const userId = req.decoded.id;
                const { imageUrl } = req.body;

                const deviceServiceInstance = Container.get(DeviceService);

                await deviceServiceInstance.DeleteImage(
                    deviceId,
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
        '/:deviceId',
        userAuth,
        validateRequestParams(ParamDeviceUUID),
        async (req: TokenRequest, res: Response, next: NextFunction) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling Delete Device endpoint');

            try {
                const deviceId = req.params.deviceId;
                const userId = req.decoded.id;

                const deviceServiceInstance = Container.get(DeviceService);

                await deviceServiceInstance.DeleteDevice(deviceId, userId);

                res.status(200).end();
            } catch (e) {
                return next(e);
            }
        }
    );
};
