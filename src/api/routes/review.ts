import { TokenRequest } from '@api/middlewares/privateRoute';
import { LoggerType } from '@loaders/logger';
import Container from 'typedi';
import { Router, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validateRequestBody } from 'zod-express-middleware';
import { NewReviewDTO } from '@interfaces/review';
import ReviewService from '@services/review';
import { uploadImages } from '@utils/functions';
import * as console from 'node:console';

const route = Router();

export default (app: Router) => {
    app.use('/review', route);

    route.post(
        '/new',
        uploadImages('public/uploads/review').array('images'),
        validateRequestBody(NewReviewDTO),
        async (
            req: TokenRequest & {
                body: z.infer<typeof NewReviewDTO>;
            },
            res: Response,
            next: NextFunction
        ) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling New Review endpoint');
            try {
                const imagesPath: string[] = (
                    req.files as Express.Multer.File[]
                ).map((file: Express.Multer.File) => file.path);

                const reviewServiceInstance = Container.get(ReviewService);
                const {
                    comfortRating,
                    experienceRating,
                    valueRating,
                    review,
                    apartmentId,
                } = req.body;

                const newReview = await reviewServiceInstance.CreateReview(
                    comfortRating,
                    experienceRating,
                    valueRating,
                    review,
                    apartmentId,
                    imagesPath
                );

                res.status(200).json(newReview);
            } catch (e) {
                console.log(e);
                return next(e);
            }
        }
    );

    route.get(
        '/:apartmentId/status',
        async (req: TokenRequest, res: Response, next: NextFunction) => {
            const Logger: LoggerType = Container.get('logger');
            Logger.debug('Calling check if  review already exists endpoint');
            try {
                const reviewServiceInstance = Container.get(ReviewService);
                const apartmentId = req.params.apartmentId;

                const doesReviewExists =
                    await reviewServiceInstance.CheckIfReviewExistsForCurrentPeriod(
                        apartmentId
                    );

                res.status(200).json(doesReviewExists);
            } catch (e) {
                return next(e);
            }
        }
    );
};
