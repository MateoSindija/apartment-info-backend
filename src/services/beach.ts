import { Inject, Service } from 'typedi';
import { LoggerType } from '@loaders/logger';
import { ForbiddenError } from '@errors/appError';
import { Apartment } from '@models/apartment';
import { Beach } from '@models/beach';
import { BeachApartment } from '@models/beachApartment';
import {
    deleteImage,
    handleImageUrls,
    handleTitleImage,
} from '@utils/functions';

@Service()
export default class BeachService {
    constructor(@Inject('logger') private Logger: LoggerType) {}

    public async GetBeachById(beachId: string): Promise<Beach> {
        this.Logger.info('Getting beach!');

        const beach = await Beach.findByPk(beachId, {
            include: Apartment,
        });

        if (!beach) {
            throw new Error('Beach not found');
        }

        this.Logger.info('Found Beach!');
        return beach;
    }

    public async UpdateImage(
        beachId: string,
        userId: string,
        imagesPath: string[]
    ): Promise<void> {
        this.Logger.info('Updating images!');

        const beach = await Beach.findByPk(beachId);

        if (beach?.ownerId !== userId)
            throw new ForbiddenError('You are not the owner of this object.');

        await beach.update({ imagesPath: imagesPath });

        this.Logger.info('Images updated');
    }
    public async CreateBeach(
        title: string,
        description: string,
        apartmentId: string,
        lat: number,
        lng: number,
        userId: string,
        terrainType: string,
        imagePaths: string[],
        titleImage: string
    ): Promise<string> {
        this.Logger.info('Creating new Beach!');

        const apartment = await Apartment.findByPk(apartmentId);

        if (!apartment?.apartmentId)
            throw new Error('This apartment does not exists');

        const beach = await Beach.create({
            title: title,
            description: description,
            apartmentId: apartmentId,
            terrainType: terrainType,
            location: { type: 'Point', coordinates: [lng, lat] },
            imagesUrl: imagePaths,
            ownerId: userId,
            titleImage: titleImage,
        });

        this.Logger.info('Created new beach!');

        await BeachApartment.create({
            apartmentId: apartmentId,
            beachId: beach.beachId,
        });

        return beach.beachId;
    }
    public async UpdateBeach(
        title: string,
        description: string,
        userId: string,
        lat: number,
        lng: number,
        terrainType: string,
        beachId: string,
        titleImage: string,
        imagesPath: string[] | undefined,
        imagesUrlArray: string[] | undefined
    ): Promise<void> {
        this.Logger.info('Updating Beach!');

        const beach = await Beach.findByPk(beachId);
        if (beach?.ownerId !== userId)
            throw new ForbiddenError('You are not the owner of this object.');

        const existingImagesUrl = beach.imagesUrl || [];

        const imagesToDelete = existingImagesUrl.filter(
            (imageUrl) => !imagesUrlArray?.includes(imageUrl)
        );
        for (const imageUrl of imagesToDelete) {
            await deleteImage(imageUrl);
        }

        await Beach.update(
            {
                title: title,
                description: description,
                terrainType: terrainType,
                location: { type: 'Point', coordinates: [lng, lat] },
                imagesUrl: handleImageUrls(imagesPath, imagesUrlArray),
                titleImage: handleTitleImage(titleImage, imagesPath),
            },
            { where: { beachId: beachId } }
        );

        this.Logger.info('Updated Beach!');
    }

    public async DeleteBeach(
        beachId: string,
        userId: string,
        apartmentId: string
    ): Promise<void> {
        this.Logger.info('Deleting beach');

        const beach = await Beach.findByPk(beachId);

        if (!beach) throw new Error('Beach not found');
        if (beach.ownerId !== userId) {
            throw new ForbiddenError('You dont have access to this Beach');
        }
        await BeachApartment.destroy({
            where: { beachId: beachId, apartmentId: apartmentId },
        });

        const beachCountInApartmentAttraction = await BeachApartment.count({
            where: { beachId: beachId },
        });

        if (beachCountInApartmentAttraction === 0) {
            for (const imgPath of beach.imagesUrl) {
                await deleteImage(imgPath);
            }
            await beach.destroy();
        }

        this.Logger.info('Beach  deleted');
    }
}
