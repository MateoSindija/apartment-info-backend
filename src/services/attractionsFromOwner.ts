import { Inject, Service } from 'typedi';
import Logger, { LoggerType } from '@loaders/logger';
import { Includeable, Op } from 'sequelize';
import { Beach } from '@models/beach';
import { Apartment } from '@models/apartment';
import { Device } from '@models/device';
import { Shop } from '@models/shop';
import { Sight } from '@models/sight';
import { Model, ModelCtor } from 'sequelize-typescript';

@Service()
export default class AttractionsFromOwnerService {
    constructor(@Inject('logger') private Logger: LoggerType) {}

    public async GetAttractionsFromOtherApartments(
        ownerId: string,
        currentApartmentId: string,
        model: Includeable,
        alias: string,
        idField: string
    ): Promise<Beach[] | Apartment[] | Device[] | Shop[] | Sight[]> {
        Logger.info(`Getting all ${alias} from user`);

        const currentApartment = await Apartment.findOne({
            where: { apartmentId: currentApartmentId },
            include: model,
        });

        if (!currentApartment) {
            Logger.warn(
                `Current apartment with id ${currentApartmentId} not found`
            );
            return [];
        }

        const currentAttractionsList = currentApartment[alias] || [];

        const currentAttractionIds = new Set<string | number>(
            currentAttractionsList.map(
                (attraction: Beach | Apartment | Device | Shop | Sight) =>
                    attraction[idField]
            )
        );

        const otherApartments = await Apartment.findAll({
            where: {
                ownerId: ownerId,
                apartmentId: { [Op.not]: currentApartmentId },
            },
            include: model,
        });

        const uniqueAttractionIds = new Set<string | number>();
        const result: Beach[] | Apartment[] | Device[] | Shop[] | Sight[] = [];

        for (const apartment of otherApartments) {
            const attractionsList = apartment[alias] || [];
            for (const attraction of attractionsList) {
                const attractionId = attraction[idField];
                if (
                    attractionId &&
                    !currentAttractionIds.has(attractionId) &&
                    !uniqueAttractionIds.has(attractionId)
                ) {
                    uniqueAttractionIds.add(attractionId);
                    result.push(attraction);
                }
            }
        }

        return result;
    }
    public async AddExistingAttractionToApartment(
        model: ModelCtor<Model>,
        values: { [key: string]: string; apartmentId: string }
    ): Promise<void> {
        Logger.info(`Adding attraction to apartment`);

        await model.create(values);

        Logger.info(`Attraction added`);
    }
}
