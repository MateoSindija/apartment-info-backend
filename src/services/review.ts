import { Inject, Service } from 'typedi';
import { LoggerType } from '@loaders/logger';
import { Apartment } from '@models/apartment';
import { Review } from '@models/review';
import { Reservation } from '@models/reservation';
import { Op } from 'sequelize';
import moment from 'moment-timezone';

@Service()
export default class ReviewService {
    constructor(@Inject('logger') private Logger: LoggerType) {}

    public async CreateReview(
        comfortRating: number,
        experienceRating: number,
        valueRating: number,
        reviewText: string | undefined,
        apartmentId: string,
        imagesPath: string[] | undefined
    ): Promise<Review> {
        this.Logger.info('Creating new Review!');

        const apartment = await Apartment.findByPk(apartmentId);
        if (!apartment) throw new Error('Failed to find apartment!');

        const now = moment().tz('Europe/Berlin').startOf('day').toDate();

        const reservation = await Reservation.findOne({
            where: {
                apartmentId: apartmentId,
                startDate: { [Op.lte]: now },
                endDate: { [Op.gte]: now },
            },
        });
        if (!reservation) throw new Error('Reservation not found');

        const review = await Review.create({
            comfortRating: comfortRating,
            experienceRating: experienceRating,
            valueRating: valueRating,
            review: reviewText,
            apartmentId: apartmentId,
            reservationId: reservation.reservationId,
            ...(imagesPath && { imagesUrl: imagesPath }),
        });

        this.Logger.info('Created new Review!');
        return review;
    }

    public async GetReviewsByApartmentId(
        apartmentId: string
    ): Promise<Review[]> {
        this.Logger.info('Fetching reviews for apartment ID: ', apartmentId);

        const apartment = await Apartment.findByPk(apartmentId);
        if (!apartment) throw new Error('Apartment not found');

        const reviews = await Review.findAll({
            where: { apartmentId: apartmentId },
            include: [
                {
                    model: Reservation,
                    required: true,
                },
            ],
        });

        this.Logger.info(
            'Fetched reviews with reservations for apartment ID: ',
            apartmentId
        );
        return reviews;
    }

    public async CheckIfReviewExistsForCurrentPeriod(
        apartmentId: string
    ): Promise<boolean> {
        this.Logger.info(
            'Checking if review exists within the current reservation period for apartment ID:',
            apartmentId
        );

        const now = moment().tz('Europe/Berlin').startOf('day').toDate();

        const currentReservation = await Reservation.findOne({
            where: {
                apartmentId: apartmentId,
                startDate: { [Op.lte]: now },
                endDate: { [Op.gte]: now },
            },
        });

        if (!currentReservation) {
            this.Logger.info(
                'No active reservation found for apartment ID:',
                apartmentId
            );
            return false;
        }

        // Check if a review with the same ratings exists for the current reservation period
        const existingReview = await Review.findOne({
            where: {
                apartmentId: apartmentId,
                reservationId: currentReservation.reservationId,
            },
        });

        if (existingReview) {
            this.Logger.info(
                'Review already exists for the current reservation period.'
            );
            return true;
        }

        this.Logger.info('No review found for the current reservation period.');
        return false;
    }
}
