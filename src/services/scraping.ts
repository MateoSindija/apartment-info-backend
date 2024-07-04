import { Inject, Service } from 'typedi';
import { LoggerType } from '@loaders/logger';
import { Apartment } from '@models/apartment';

import { ForbiddenError } from '@errors/appError';
import { Scraping } from '@models/scraping';
import { Organization } from '@models/organization';
import axios from 'axios';
import { load } from 'cheerio';
import * as console from 'console';

@Service()
export default class ScrapingService {
    constructor(@Inject('logger') private Logger: LoggerType) {}

    public async AddScrapingUrl(
        url: string,
        apartmentId: string,
        siteType: 'TripAdvisor',
        userId: string
    ): Promise<void> {
        this.Logger.info('Adding new scraping link!');

        const apartment = await Apartment.findByPk(apartmentId);

        if (!apartment) {
            this.Logger.info('Failed to find apartment!');
            return;
        }

        if (apartment?.organization.ownerId !== userId) {
            throw new ForbiddenError('You dont have access to this Apartment');
        }

        await Scraping.create({
            url: url,
            organizationId: apartment.apartmentId,
            apartmentId: apartment.apartmentId,
            siteType: siteType,
        });

        this.Logger.info('Added new scraping link');

        const { data } = await axios(url);

        const $ = load(data);
        switch (siteType) {
            case 'TripAdvisor':
                const selectedElem = '.DSinh';

                $(selectedElem).each((parentIndex, parentElem) => {
                    let keyIndex = 0;
                    const data = {};
                    if (parentIndex) {
                        $(parentElem)
                            .children()
                            .each((childId, childElem) => {
                                console.log(childElem);
                            });
                    }
                });
        }
    }

    public async DeleteScrapingLink(
        scrapingId: string,
        userId: string
    ): Promise<void> {
        this.Logger.info('Deleting scraping link!');

        const scraping = await Scraping.findByPk(scrapingId, {
            include: [{ model: Organization, required: true }],
        });

        if (scraping?.organization.ownerId !== userId) {
            throw new ForbiddenError('You dont have access to this Apartment');
        }

        await scraping.destroy();
    }
}
