import { Inject, Service } from 'typedi';
import { LoggerType } from '@loaders/logger';
import { Apartment } from '@models/apartment';
import { Reservation } from '@models/reservation';
import { ForbiddenError } from '@errors/appError';

@Service()
export default class ReservationService {
    constructor(@Inject('logger') private Logger: LoggerType) {}

    public async GetReservationByApartment(
        apartmentId: string
    ): Promise<Reservation[] | undefined> {
        this.Logger.info('Getting Reservation periods for apartment!');

        const apartmentWithReservation = await Apartment.findByPk(apartmentId, {
            include: [{ model: Reservation, required: true }],
        });

        this.Logger.info('Found Reservation periods!');
        return apartmentWithReservation?.reservations;
    }
    public async CreateReservation(
        apartmentId: string,
        userId: string,
        isRequestFromWebCheck: boolean,
        startDate: Date,
        endDate: Date
    ): Promise<string> {
        this.Logger.info('Creating new reservation period!');

        const apartmentWithReservations = await Apartment.findByPk(
            apartmentId,
            {
                include: [{ model: Reservation, required: true }],
            }
        );

        if (
            apartmentWithReservations?.ownerId !== userId &&
            !isRequestFromWebCheck
        ) {
            throw new ForbiddenError('You dont have access to this apartment');
        }

        if (
            apartmentWithReservations?.reservations.find(
                (reservation) => reservation.startDate === startDate
            ) ||
            apartmentWithReservations?.reservations.find(
                (reservation) => reservation.endDate === endDate
            )
        ) {
            throw new Error('Date is already occupied');
        }

        const reservation = await Reservation.create({
            apartmentId: apartmentId,
            startDate: startDate,
            endDate: endDate,
        });
        return reservation.reservationId;
    }
    public async UpdateReservation(
        reservationId: string,
        userId: string,
        startDate: Date,
        endDate: Date
    ): Promise<void> {
        this.Logger.info('Updating reservation period!');

        const reservationWithOrganization = await Reservation.findByPk(
            reservationId,
            {
                include: [
                    {
                        model: Apartment,
                        required: true,
                    },
                ],
            }
        );

        if (reservationWithOrganization?.apartment.ownerId !== userId) {
            throw new ForbiddenError('You dont have access to this apartment');
        }

        await Reservation.update(
            {
                startDate: startDate,
                endDate: endDate,
            },
            { where: { reservationId: reservationId } }
        );
    }

    public async DeleteReservation(
        reservationId: string,
        userId: string
    ): Promise<void> {
        this.Logger.info('Deleting reservation period');

        const reservation = await Reservation.findByPk(reservationId, {
            include: [{ model: Apartment, required: true }],
        });

        if (reservation?.apartment.ownerId !== userId) {
            throw new ForbiddenError('You dont have access to this Apartment');
        }

        if (!reservation) throw new Error('Reservation not found');
        await reservation.destroy();

        this.Logger.info('Reservation deleted');
    }
}
