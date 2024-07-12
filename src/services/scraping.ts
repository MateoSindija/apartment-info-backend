import { Inject, Service } from 'typedi';
import { LoggerType } from '@loaders/logger';
import { Apartment } from '@models/apartment';

import { ForbiddenError } from '@errors/appError';
import { Scraping } from '@models/scraping';
import * as console from 'console';
import puppeteer from 'puppeteer';

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

        if (apartment?.ownerId !== userId) {
            throw new ForbiddenError('You dont have access to this Apartment');
        }

        // await Scraping.create({
        //     url: url,
        //     organizationId: apartment.apartmentId,
        //     apartmentId: apartment.apartmentId,
        //     siteType: siteType,
        // });

        this.Logger.info('Added new scraping link');
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);
        console.log(page.$eval('ul.DSinh', (el) => console.log(el)));
    }

    public async DeleteScrapingLink(
        scrapingId: string,
        userId: string
    ): Promise<void> {
        this.Logger.info('Deleting scraping link!');

        const scraping = await Scraping.findByPk(scrapingId, {
            include: [{ model: Apartment, required: true }],
        });

        if (scraping?.apartment.ownerId !== userId) {
            throw new ForbiddenError('You dont have access to this Apartment');
        }

        await scraping.destroy();
    }
}
