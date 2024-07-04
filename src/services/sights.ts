import { Inject, Service } from 'typedi';
import { LoggerType } from '@loaders/logger';
import { Organization } from '@models/organization';
import { ForbiddenError } from '@errors/appError';
import { Apartment } from '@models/apartment';
import fs from 'fs';
import { Sight } from '@models/sight';

@Service()
export default class SightService {
    constructor(@Inject('logger') private Logger: LoggerType) {}

    public async GetSightById(sightId: string): Promise<Sight> {
        this.Logger.info('Getting all sights!');

        const sight = await Sight.findByPk(sightId);

        if (!sight) {
            throw new Error('Sight not found');
        }

        this.Logger.info('Found sight!');
        return sight;
    }
    public async UpdateImage(
        shopId: string,
        userId: string,
        imagesPath: string[]
    ): Promise<void> {
        this.Logger.info('Updating images!');

        const sightWithOrganization = await Sight.findByPk(shopId, {
            include: [
                {
                    model: Organization,
                    required: true,
                },
            ],
        });
        if (sightWithOrganization?.organization.ownerId !== userId)
            throw new ForbiddenError('You are not the owner of this object.');

        await sightWithOrganization.update({ imagesPath: imagesPath });

        this.Logger.info('Images updated');
    }
    public async DeleteImage(
        shopId: string,
        userId: string,
        imagePath: string
    ): Promise<void> {
        this.Logger.info('Deleting files!');

        const sightWithOrganization = await Sight.findByPk(shopId, {
            include: [
                {
                    model: Organization,
                    required: true,
                },
            ],
        });
        if (sightWithOrganization?.organization.ownerId !== userId)
            throw new ForbiddenError('You are not the owner of this object.');

        if (sightWithOrganization) {
            sightWithOrganization.imagesUrl =
                sightWithOrganization.imagesUrl.filter(
                    (url) => url !== imagePath
                );
            await sightWithOrganization.save();
            await fs.unlink(imagePath, (err) => {
                if (err) this.Logger.error(err);
                else {
                    this.Logger.info('File deleted');
                }
            });
            this.Logger.info('Images updated');
        }

        this.Logger.info('Sight not found');
    }
    public async CreateSight(
        title: string,
        description: string,
        apartmentId: string,
        lat: number,
        lng: number,
        imagePaths: string[],
        titleImage: string
    ): Promise<string> {
        this.Logger.info('Creating new shop!');

        const apartment = await Apartment.findByPk(apartmentId);

        if (apartment?.organizationId) {
            const sight = await Sight.create({
                title: title,
                description: description,
                apartmentId: apartmentId,
                lat: lat,
                lng: lng,
                imagesUrl: imagePaths,
                organizationId: apartment.organizationId,
                titleImage: titleImage,
            });

            this.Logger.info('Created new sight!');
            return sight.sightId;
        }

        this.Logger.info('Failed to find apartment!');

        return '';
    }
    public async UpdateSight(
        title: string,
        description: string,
        userId: string,
        lat: number,
        lng: number,
        sightId: string,
        titleImage: string
    ): Promise<void> {
        this.Logger.info('Updating Sight!');

        const sightWithOrganization = await Sight.findByPk(sightId, {
            include: [
                {
                    model: Organization,
                    required: true,
                },
            ],
        });
        if (sightWithOrganization?.organization.ownerId !== userId)
            throw new ForbiddenError('You are not the owner of this object.');

        await Sight.update(
            {
                title: title,
                description: description,
                lat: lat,
                lng: lng,
                titleImage: titleImage,
            },
            { where: { sightId: sightId } }
        );

        this.Logger.info('Updated sight!');
    }

    public async DeleteSight(sightId: string, userId: string): Promise<void> {
        this.Logger.info('Deleting sight');

        const sight = await Sight.findByPk(sightId, {
            include: [{ model: Organization, required: true }],
        });

        if (sight?.organization.ownerId !== userId) {
            throw new ForbiddenError('You dont have access to this Sight');
        }

        if (!sight) throw new Error('Sight not found');
        await sight.destroy();

        this.Logger.info('Sight deleted');
    }
}
