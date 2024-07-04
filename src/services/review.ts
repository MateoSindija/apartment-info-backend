import { Inject, Service } from 'typedi';
import { LoggerType } from '@loaders/logger';
import { Apartment } from '@models/apartment';
import { Review } from '@models/review';

@Service()
export default class ReviewService {
    constructor(@Inject('logger') private Logger: LoggerType) {}

    public async CreateReview(
        comfortRating: number,
        experienceRating: number,
        valueRating: number,
        reviewText: string | undefined,
        apartmentId: string
    ): Promise<string> {
        this.Logger.info('Creating new Review!');

        const apartment = await Apartment.findByPk(apartmentId);

        if (apartment) {
            const review = await Review.create({
                comfortRating: comfortRating,
                experienceRating: experienceRating,
                valueRating: valueRating,
                review: reviewText,
            });

            this.Logger.info('Created new Review!');
            return review.reviewId;
        }

        this.Logger.info('Failed to find apartment!');

        return '';
    }
}
