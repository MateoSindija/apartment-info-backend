import { TokenRequest, userAuth } from '@api/middlewares/privateRoute';
import { LoggerType } from '@loaders/logger';
import Container from 'typedi';
import { Router, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
    validateRequestBody,
    validateRequestParams,
} from 'zod-express-middleware';
import {
    NewDeviceDTO,
    ParamDeviceUUID,
    UpdateDeviceDTO,
} from '@interfaces/device';
import DeviceService from '@services/device';
import { uploadImages } from '@utils/functions';

const route = Router();

export default (app: Router) => {
    app.use('/device', route);

    route.post(
        '/new',
        userAuth,
        uploadImages('public/uploads/device').array('images'),
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
                const userID = req.decoded.id;
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
                    imagesPath[titleImage],
                    userID
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
        uploadImages('public/uploads/device').array('images'),
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

                res.status(200).json(device);
            } catch (e) {
                return next(e);
            }
        }
    );

    route.patch(
        '/:deviceId',
        userAuth,
        uploadImages('public/uploads/device').array('images'),
        validateRequestParams(ParamDeviceUUID),
        validateRequestBody(UpdateDeviceDTO),
        async (
            req: TokenRequest & {
                body: z.infer<typeof UpdateDeviceDTO>;
            },
            res: Response,
            next: NextFunction
        ) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling Edit Device endpoint');

            try {
                const deviceId = req.params.deviceId;
                const userId = req.decoded.id;
                const { title, description, titleImage, imageUrlArray } =
                    req.body;
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

                const deviceServiceInstance = Container.get(DeviceService);

                await deviceServiceInstance.UpdateDevice(
                    title,
                    description,
                    deviceId,
                    titleImage,
                    userId,
                    imagesPath,
                    imageUrlArray
                );

                res.status(200).end();
            } catch (e) {
                return next(e);
            }
        }
    );

    route.delete(
        '/:apartmentId/:deviceId',
        userAuth,
        validateRequestParams(ParamDeviceUUID),
        async (req: TokenRequest, res: Response, next: NextFunction) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling Delete Device endpoint');

            try {
                const deviceId = req.params.deviceId;
                const apartmentId = req.params.apartmentId;
                const userId = req.decoded.id;

                const deviceServiceInstance = Container.get(DeviceService);

                await deviceServiceInstance.DeleteDevice(
                    deviceId,
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
