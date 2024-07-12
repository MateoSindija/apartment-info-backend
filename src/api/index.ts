import { Router } from 'express';
import shop from './routes/shop';
import apartment from '@api/routes/apartment';
import auth from '@api/routes/auth';
import beach from '@api/routes/beach';
import device from '@api/routes/device';
import reservation from '@api/routes/reservation';
import restaurant from '@api/routes/restaurant';
import review from '@api/routes/review';
import scraping from '@api/routes/scraping';
import sight from '@api/routes/sight';
// guaranteed to get dependencies
export default () => {
    const app = Router();
    auth(app);
    shop(app);
    apartment(app);
    beach(app);
    device(app);
    reservation(app);
    restaurant(app);
    review(app);
    scraping(app);
    sight(app);

    return app;
};
