import { Inject, Service } from 'typedi';
import { LoggerType } from '@loaders/logger';
import { Organization } from '@models/organization';
import { ForbiddenError } from '@errors/appError';
import { Apartment } from '@models/apartment';
import fs from 'fs';
import { Device } from '@models/device';

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

        const deviceWithOrganization = await Device.findByPk(deviceId, {
            include: [
                {
                    model: Organization,
                    required: true,
                },
            ],
        });
        if (deviceWithOrganization?.organization.ownerId !== userId)
            throw new ForbiddenError('You are not the owner of this object.');

        await deviceWithOrganization.update({ imagesPath: imagesPath });

        this.Logger.info('Images updated');
    }
    public async DeleteImage(
        deviceId: string,
        userId: string,
        imagePath: string
    ): Promise<void> {
        this.Logger.info('Deleting files!');

        const deviceWithOrganization = await Device.findByPk(deviceId, {
            include: [
                {
                    model: Organization,
                    required: true,
                },
            ],
        });
        if (deviceWithOrganization?.organization.ownerId !== userId)
            throw new ForbiddenError('You are not the owner of this object.');

        if (deviceWithOrganization) {
            deviceWithOrganization.imagesUrl =
                deviceWithOrganization.imagesUrl.filter(
                    (url) => url !== imagePath
                );
            await deviceWithOrganization.save();
            await fs.unlink(imagePath, (err) => {
                if (err) this.Logger.error(err);
                else {
                    this.Logger.info('File deleted');
                }
            });
            this.Logger.info('Images updated');
        }

        this.Logger.info('Beach not found');
    }
    public async CreateDevice(
        title: string,
        description: string,
        imagesUrl: string[],
        apartmentId: string,
        titleImage: string
    ): Promise<string> {
        this.Logger.info('Creating new Device!');

        const apartment = await Apartment.findByPk(apartmentId);

        if (apartment?.organizationId) {
            const device = await Device.create({
                title: title,
                description: description,
                imagesUrl: imagesUrl,
                apartmentId: apartmentId,
                titleImage: titleImage,
                organizationId: apartment.organizationId,
            });

            this.Logger.info('Created new Device!');
            return device.deviceId;
        }

        this.Logger.info('Failed to find apartment!');

        return '';
    }
    public async UpdateDevice(
        title: string,
        description: string,
        deviceId: string,
        titleImage: string,
        userId: string
    ): Promise<void> {
        this.Logger.info('Updating Beach!');

        const deviceWithOrganization = await Device.findByPk(deviceId, {
            include: [
                {
                    model: Organization,
                    required: true,
                },
            ],
        });
        if (deviceWithOrganization?.organization.ownerId !== userId)
            throw new ForbiddenError('You are not the owner of this object.');

        await Device.update(
            {
                title: title,
                description: description,
                titleImage: titleImage,
            },
            { where: { deviceId: deviceId } }
        );

        this.Logger.info('Updated Device!');
    }

    public async DeleteDevice(deviceId: string, userId: string): Promise<void> {
        this.Logger.info('Deleting device');

        const device = await Device.findByPk(deviceId, {
            include: [{ model: Organization, required: true }],
        });

        if (device?.organization.ownerId !== userId) {
            throw new ForbiddenError('You dont have access to this Device');
        }

        if (!device) throw new Error('Device not found');
        await device.destroy();

        this.Logger.info('Device deleted');
    }
}
