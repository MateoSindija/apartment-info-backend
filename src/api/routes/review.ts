import { TokenRequest } from '@api/middlewares/privateRoute';
import { LoggerType } from '@loaders/logger';
import Container from 'typedi';
import { Router, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validateRequestBody } from 'zod-express-middleware';
import { NewReviewDTO } from '@interfaces/review';
import ReviewService from '@services/review';

const route = Router();

export default (app: Router) => {
    app.use('/review', route);

    route.post(
        '/new',
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
                const reviewServiceInstance = Container.get(ReviewService);
                const {
                    comfortRating,
                    experienceRating,
                    valueRating,
                    review,
                    apartmentId,
                } = req.body;

                const reviewId = await reviewServiceInstance.CreateReview(
                    comfortRating,
                    experienceRating,
                    valueRating,
                    review,
                    apartmentId
                );

                res.status(200).json({ reviewId });
            } catch (e) {
                return next(e);
            }
        }
    );
};
