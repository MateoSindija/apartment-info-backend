import { TokenRequest, userAuth } from '@api/middlewares/privateRoute';
import { LoggerType } from '@loaders/logger';
import Container from 'typedi';
import { Router, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
    validateRequestBody,
    validateRequestQuery,
} from 'zod-express-middleware';
import {
    NewOrganizationDTO,
    OrganizationParamUUID,
} from '@interfaces/organization';
import OrganizationService from '@services/organization';

const route = Router();

export default (app: Router) => {
    app.use('/organization', route);

    route.get(
        '',
        userAuth,
        async (req: TokenRequest, res: Response, next: NextFunction) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling Get Organizations endpoint');
            try {
                const userId = req.decoded.id;
                const organizationServiceInstance =
                    Container.get(OrganizationService);

                const organizations =
                    await organizationServiceInstance.GetOrganizations(userId);

                res.status(200).json({ organizations });
            } catch (e) {
                return next(e);
            }
        }
    );

    route.post(
        '/new',
        userAuth,
        validateRequestBody(NewOrganizationDTO),
        async (
            req: TokenRequest & {
                body: z.infer<typeof NewOrganizationDTO>;
            },
            res: Response,
            next: NextFunction
        ) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling New Organization endpoint');
            try {
                const userId = req.decoded.id;
                const organizationServiceInstance =
                    Container.get(OrganizationService);
                const { name } = req.body;

                const organizationId =
                    await organizationServiceInstance.CreateOrganization(
                        name,
                        userId
                    );

                res.status(200).json({ organizationId });
            } catch (e) {
                return next(e);
            }
        }
    );

    route.patch(
        '/:organizationId',
        userAuth,
        validateRequestBody(NewOrganizationDTO),
        validateRequestQuery(OrganizationParamUUID),
        async (
            req: TokenRequest & {
                body: z.infer<typeof NewOrganizationDTO>;
            },
            res: Response,
            next: NextFunction
        ) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling Edit Organization endpoint');

            try {
                const organizationId = req.params.organizationId;
                const userId = req.decoded.id;
                const { name } = req.body;

                const organizationServiceInstance =
                    Container.get(OrganizationService);

                await organizationServiceInstance.UpdateOrganization(
                    name,
                    organizationId,
                    userId
                );

                res.status(200).end();
            } catch (e) {
                return next(e);
            }
        }
    );

    route.delete(
        '/:organizationId',
        userAuth,
        validateRequestQuery(OrganizationParamUUID),
        async (req: TokenRequest, res: Response, next: NextFunction) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling Delete Organization endpoint');

            try {
                const organizationId = req.params.organizationId;
                const userId = req.decoded.id;

                const organizationServiceInstance =
                    Container.get(OrganizationService);

                await organizationServiceInstance.DeleteOrganization(
                    organizationId,
                    userId
                );

                res.status(200).end();
            } catch (e) {
                return next(e);
            }
        }
    );
};
