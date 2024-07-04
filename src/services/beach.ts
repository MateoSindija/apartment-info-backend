import { Inject, Service } from 'typedi';
import { LoggerType } from '@loaders/logger';
import { Organization } from '@models/organization';
import { ForbiddenError } from '@errors/appError';
import { Apartment } from '@models/apartment';
import fs from 'fs';
import { Beach } from '@models/beach';
import { Sight } from '@models/sight';

@Service()
export default class BeachService {
    constructor(@Inject('logger') private Logger: LoggerType) {}

    public async GetBeachById(sightId: string): Promise<Sight> {
        this.Logger.info('Getting beach!');

        const sight = await Sight.findByPk(sightId);

        if (!sight) {
            throw new Error('Sight not found');
        }

        this.Logger.info('Found sight!');
        return sight;
    }
    public async UpdateImage(
        beachId: string,
        userId: string,
        imagesPath: string[]
    ): Promise<void> {
        this.Logger.info('Updating images!');

        const beachWithOrganization = await Beach.findByPk(beachId, {
            include: [
                {
                    model: Organization,
                    required: true,
                },
            ],
        });
        if (beachWithOrganization?.organization.organizationId !== userId)
            throw new ForbiddenError('You are not the owner of this object.');

        await beachWithOrganization.update({ imagesPath: imagesPath });

        this.Logger.info('Images updated');
    }
    public async DeleteImage(
        beachId: string,
        userId: string,
        imagePath: string
    ): Promise<void> {
        this.Logger.info('Deleting files!');

        const beachWithOrganization = await Beach.findByPk(beachId, {
            include: [
                {
                    model: Organization,
                    required: true,
                },
            ],
        });
        if (beachWithOrganization?.organization.ownerId !== userId)
            throw new ForbiddenError('You are not the owner of this object.');

        if (beachWithOrganization) {
            beachWithOrganization.imagesUrl =
                beachWithOrganization.imagesUrl.filter(
                    (url) => url !== imagePath
                );
            await beachWithOrganization.save();
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
    public async CreateBeach(
        title: string,
        description: string,
        apartmentId: string,
        lat: number,
        lng: number,
        terrainType: string,
        imagePaths: string[],
        titleImage: string
    ): Promise<string> {
        this.Logger.info('Creating new Beach!');

        const apartment = await Apartment.findByPk(apartmentId);

        if (apartment?.organizationId) {
            const beach = await Beach.create({
                title: title,
                description: description,
                apartmentId: apartmentId,
                terrainType: terrainType,
                lat: lat,
                lng: lng,
                imagesUrl: imagePaths,
                organizationId: apartment.organizationId,
                titleImage: titleImage,
            });

            this.Logger.info('Created new beach!');
            return beach.beachId;
        }

        this.Logger.info('Failed to find apartment!');

        return '';
    }
    public async UpdateBeach(
        title: string,
        description: string,
        userId: string,
        lat: number,
        lng: number,
        terrainType: string,
        beachId: string,
        titleImage: string
    ): Promise<void> {
        this.Logger.info('Updating Beach!');

        const beachWithOrganization = await Beach.findByPk(beachId, {
            include: [
                {
                    model: Organization,
                    required: true,
                },
            ],
        });
        if (beachWithOrganization?.organization.ownerId !== userId)
            throw new ForbiddenError('You are not the owner of this object.');

        await Beach.update(
            {
                title: title,
                description: description,
                terrainType: terrainType,
                lat: lat,
                lng: lng,
                titleImage: titleImage,
            },
            { where: { beachId: beachId } }
        );

        this.Logger.info('Updated Beach!');
    }

    public async DeleteBeach(beachId: string, userId: string): Promise<void> {
        this.Logger.info('Deleting beach');

        const beach = await Beach.findByPk(beachId, {
            include: [{ model: Organization, required: true }],
        });

        if (beach?.organization.ownerId !== userId) {
            throw new ForbiddenError('You dont have access to this Beach');
        }

        if (!beach) throw new Error('Beach not found');
        await beach.destroy();

        this.Logger.info('Beach  deleted');
    }
}
