import { Inject, Service } from 'typedi';
import { LoggerType } from '@loaders/logger';
import { ForbiddenError } from '@errors/appError';
import { Apartment } from '@models/apartment';
import { Device } from '@models/device';
import { DeviceApartment } from '@models/deviceApartment';
import {
    deleteImage,
    handleImageUrls,
    handleTitleImage,
} from '@utils/functions';

@Service()
export default class DeviceService {
    constructor(@Inject('logger') private Logger: LoggerType) {}

    public async GetDeviceById(sightId: string): Promise<Device> {
        this.Logger.info('Getting Beach!');

        const device = await Device.findByPk(sightId);

        if (!device) {
            throw new Error('Device not found');
        }

        this.Logger.info('Found device!');
        return device;
    }
    public async UpdateImage(
        deviceId: string,
        userId: string,
        imagesPath: string[]
    ): Promise<void> {
        this.Logger.info('Updating images!');

        const device = await Device.findByPk(deviceId);
        if (device?.ownerId !== userId)
            throw new ForbiddenError('You are not the owner of this object.');

        await device.update({ imagesPath: imagesPath });

        this.Logger.info('Images updated');
    }

    public async CreateDevice(
        title: string,
        description: string,
        imagesUrl: string[],
        apartmentId: string,
        titleImage: string,
        userId: string
    ): Promise<string> {
        this.Logger.info('Creating new Device!');

        const apartment = await Apartment.findByPk(apartmentId);

        if (!apartment) throw new Error('This apartment does not exists');
        if (apartment?.ownerId !== userId)
            throw new ForbiddenError('You are not owner of this apartment');

        const device = await Device.create({
            title: title,
            description: description,
            imagesUrl: imagesUrl,
            apartmentId: apartmentId,
            titleImage: titleImage,
            ownerId: userId,
        });

        this.Logger.info('Created new Device!');

        await DeviceApartment.create({
            deviceId: device.deviceId,
            apartmentId: apartmentId,
        });

        return device.deviceId;
    }
    public async UpdateDevice(
        title: string,
        description: string,
        deviceId: string,
        titleImage: string,
        userId: string,
        imagesPath: string[] | undefined,
        imagesUrlArray: string[] | undefined
    ): Promise<void> {
        this.Logger.info('Updating Beach!');

        const device = await Device.findByPk(deviceId);
        if (device?.ownerId !== userId)
            throw new ForbiddenError('You are not the owner of this device.');

        const existingImagesUrl = device.imagesUrl || [];

        const imagesToDelete = existingImagesUrl.filter(
            (imageUrl) => !imagesUrlArray?.includes(imageUrl)
        );
        for (const imageUrl of imagesToDelete) {
            await deleteImage(imageUrl);
        }

        await Device.update(
            {
                title: title,
                description: description,
                imagesUrl: handleImageUrls(imagesPath, imagesUrlArray),
                titleImage: handleTitleImage(titleImage, imagesPath),
            },
            { where: { deviceId: deviceId } }
        );

        this.Logger.info('Updated Device!');
    }

    public async DeleteDevice(
        deviceId: string,
        userId: string,
        apartmentId: string
    ): Promise<void> {
        const device = await Device.findByPk(deviceId);

        if (!device) {
            throw new Error('Device not found');
        }

        if (device.ownerId !== userId) {
            throw new ForbiddenError('You do not have access to this Device');
        }

        await DeviceApartment.destroy({
            where: { deviceId: deviceId, apartmentId: apartmentId },
        });

        const deviceCountInApartmentAttraction = await DeviceApartment.count({
            where: { deviceId: deviceId },
        });

        if (deviceCountInApartmentAttraction === 0) {
            for (const imgPath of device.imagesUrl) {
                await deleteImage(imgPath);
            }
            await device.destroy();
        }

        this.Logger.info('Device deleted');
    }
}
