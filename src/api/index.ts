import { Router } from 'express';
import shop from './routes/shop';
import apartment from '@api/routes/apartment';
import organization from '@api/routes/organization';
import auth from '@api/routes/auth';
// guaranteed to get dependencies
export default () => {
    const app = Router();
    auth(app);
    shop(app);
    apartment(app);
    organization(app);
    return app;
};
