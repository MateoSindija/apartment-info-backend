import {
    InitPasswordResetDTO,
    LoginDTO,
    PasswordResetBodyDTO,
    PasswordResetQueryDTO,
    RegisterDTO,
    VerifyDTO,
} from '@interfaces/auth';
import { LoggerType } from '@loaders/logger';
import AuthService from '@services/auth';
import { Router, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import Container from 'typedi';
import {
    validateRequestBody,
    validateRequestQuery,
} from 'zod-express-middleware';
const route = Router();

export default (app: Router) => {
    app.use('/', route);

    route.post(
        '/register',
        validateRequestBody(RegisterDTO),
        async (req, res: Response, next: NextFunction) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling Sign-Up endpoint with body: %o', req.body);
            try {
                const authServiceInstance = Container.get(AuthService);

                const user = {
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    password: req.body.password,
                    imagePath: null,
                };

                const info = await authServiceInstance.SignUp(user);

                return res.status(StatusCodes.CREATED).json(info);
            } catch (e) {
                return next(e);
            }
        }
    );

    route.post(
        '/login',
        validateRequestBody(LoginDTO),
        async (req, res: Response, next: NextFunction) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling Sign-In endpoint with body: %o', req.body);
            try {
                const authServiceInstance = Container.get(AuthService);
                const info = await authServiceInstance.Login(
                    req.body.email,
                    req.body.password
                );
                return res.json(info).status(StatusCodes.OK);
            } catch (e) {
                return next(e);
            }
        }
    );

    route.get(
        '/password-reset',
        validateRequestQuery(InitPasswordResetDTO),
        async (req, res: Response, next: NextFunction) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling Init Password Reset endpoint');
            try {
                const authServiceInstance = Container.get(AuthService);
                await authServiceInstance.InitResetPassword(req.query.email);
                return res.status(StatusCodes.OK).end();
            } catch (e) {
                return next(e);
            }
        }
    );

    route.post(
        '/password-reset',
        validateRequestQuery(PasswordResetQueryDTO),
        validateRequestBody(PasswordResetBodyDTO),
        async (req, res: Response, next: NextFunction) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug(
                'Calling Password Reset endpoint with body: %o',
                req.body
            );
            try {
                const authServiceInstance = Container.get(AuthService);
                await authServiceInstance.ResetPassword(
                    req.query.email,
                    req.query.token,
                    req.body.password
                );
                return res.status(StatusCodes.OK).end();
            } catch (e) {
                return next(e);
            }
        }
    );

    route.post(
        '/verify',
        validateRequestQuery(VerifyDTO),
        async (req, res: Response, next: NextFunction) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling Verify endpoint with body: %o', req.body);
            try {
                const authServiceInstance = Container.get(AuthService);
                await authServiceInstance.Verify(req.query.token);
                return res.status(StatusCodes.OK).end();
            } catch (e) {
                return next(e);
            }
        }
    );
};
