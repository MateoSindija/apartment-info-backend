import { Inject, Service } from 'typedi';
import { LoggerType } from '@loaders/logger';
import { ForbiddenError } from '@errors/appError';
import { Apartment } from '@models/apartment';
import fs from 'fs';
import { Sight } from '@models/sight';
import { SightApartment } from '@models/sightApartment';
import {
    deleteImage,
    handleImageUrls,
    handleTitleImage,
} from '@utils/functions';

@Service()
export default class SightService {
    constructor(@Inject('logger') private Logger: LoggerType) {}

    public async GetSightById(sightId: string): Promise<Sight> {
        this.Logger.info('Getting all sights!');

        const sight = await Sight.findByPk(sightId, { include: Apartment });

        if (!sight) {
            throw new Error('Sight not found');
        }

        this.Logger.info('Found sight!');
        return sight;
    }
    public async UpdateImage(
        sightId: string,
        userId: string,
        imagesPath: string[]
    ): Promise<void> {
        this.Logger.info('Updating images!');

        const sight = await Sight.findByPk(sightId);
        if (sight?.ownerId !== userId)
            throw new ForbiddenError('You are not the owner of this object.');

        await sight.update({ imagesPath: imagesPath });

        this.Logger.info('Images updated');
    }
    public async DeleteImage(
        sightId: string,
        userId: string,
        imagePath: string
    ): Promise<void> {
        this.Logger.info('Deleting files!');

        const sight = await Sight.findByPk(sightId);
        if (sight?.ownerId !== userId)
            throw new ForbiddenError(
                'You are not the owner of this apartment.'
            );

        if (sight) {
            sight.imagesUrl = sight.imagesUrl.filter(
                (url) => url !== imagePath
            );
            await sight.save();
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
        titleImage: string,
        userId: string
    ): Promise<string> {
        this.Logger.info('Creating new Sight!');

        const apartment = await Apartment.findByPk(apartmentId);

        if (!apartment) throw new Error("This apartment doesn't exists");
        if (apartment.ownerId !== userId)
            throw new ForbiddenError('You are not owner of this apartment');

        const sight = await Sight.create({
            title: title,
            description: description,
            apartmentId: apartmentId,
            location: { type: 'Point', coordinates: [lng, lat] },
            imagesUrl: imagePaths,
            ownerId: userId,
            titleImage: titleImage,
        });

        this.Logger.info('Created new sight!');

        await SightApartment.create({
            sightId: sight.sightId,
            apartmentId: apartmentId,
        });

        return sight.sightId;
    }
    public async UpdateSight(
        title: string,
        description: string,
        userId: string,
        lat: number,
        lng: number,
        sightId: string,
        titleImage: string,
        imagesPath: string[] | undefined,
        imagesUrlArray: string[] | undefined
    ): Promise<void> {
        this.Logger.info('Updating Sight!');

        const sight = await Sight.findByPk(sightId);
        if (sight?.ownerId !== userId)
            throw new ForbiddenError('You are not the owner of this object.');

        const existingImagesUrl = sight.imagesUrl || [];

        const imagesToDelete = existingImagesUrl.filter(
            (imageUrl) => !imagesUrlArray?.includes(imageUrl)
        );
        for (const imageUrl of imagesToDelete) {
            await deleteImage(imageUrl);
        }

        await Sight.update(
            {
                title: title,
                description: description,
                location: { type: 'Point', coordinates: [lng, lat] },
                imagesUrl: handleImageUrls(imagesPath, imagesUrlArray),
                titleImage: handleTitleImage(titleImage, imagesPath),
            },
            { where: { sightId: sightId } }
        );

        this.Logger.info('Updated sight!');
    }

    public async DeleteSight(
        sightId: string,
        userId: string,
        apartmentId: string
    ): Promise<void> {
        this.Logger.info('Deleting sight');

        const sight = await Sight.findByPk(sightId);

        if (!sight) {
            throw new Error('Sight not found');
        }

        if (sight.ownerId !== userId) {
            throw new ForbiddenError('You do not have access to this Sight');
        }

        await SightApartment.destroy({
            where: { sightId: sightId, apartmentId: apartmentId },
        });

        const sightCountInApartmentAttraction = await SightApartment.count({
            where: { sightId: sightId },
        });

        if (sightCountInApartmentAttraction === 0) {
            for (const imgPath of sight.imagesUrl) {
                await deleteImage(imgPath);
            }
            await sight.destroy();
        }

        this.Logger.info('Sight deleted');
    }
}
