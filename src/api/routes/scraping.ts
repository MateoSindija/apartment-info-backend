import { TokenRequest, userAuth } from '@api/middlewares/privateRoute';
import { LoggerType } from '@loaders/logger';
import Container from 'typedi';
import { Router, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validateRequestBody } from 'zod-express-middleware';
import ScrapingService from '@services/scraping';
import { NewScrapingUrlDTO } from '@interfaces/scraping';

const route = Router();

export default (app: Router) => {
    app.use('/scraping', route);

    route.post(
        '/new',
        userAuth,
        validateRequestBody(NewScrapingUrlDTO),
        async (
            req: TokenRequest & {
                body: z.infer<typeof NewScrapingUrlDTO>;
            },
            res: Response,
            next: NextFunction
        ) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling New Scraping url endpoint');
            try {
                const scrapingServiceInstance = Container.get(ScrapingService);
                const { siteUrl, apartmentId } = req.body;
                const userId = req.decoded.id;
                let siteType = '';

                if (siteUrl.includes('https://www.tripadvisor.com/Tourism')) {
                    siteType = 'TripAdvisor';
                } else {
                    throw new Error('Unsupported site type');
                }
                await scrapingServiceInstance.AddScrapingUrl(
                    siteUrl,
                    apartmentId,
                    siteType,
                    userId
                );

                res.status(200);
            } catch (e) {
                return next(e);
            }
        }
    );
};
