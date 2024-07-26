import { Inject, Service } from 'typedi';
import { LoggerType } from '@loaders/logger';
import { Apartment } from '@models/apartment';
import { Reservation } from '@models/reservation';
import { ForbiddenError } from '@errors/appError';
import { Op } from 'sequelize';

@Service()
export default class ReservationService {
    constructor(@Inject('logger') private Logger: LoggerType) {}

    public async CreateReservation(
        apartmentId: string,
        userId: string,
        startDate: Date,
        endDate: Date,
        clientName: string
    ): Promise<string> {
        this.Logger.info('Creating new reservation period!');

        const conflictingReservation = await Reservation.findOne({
            where: {
                apartmentId,
                [Op.or]: [
                    {
                        startDate: { [Op.lte]: endDate },
                        endDate: { [Op.gte]: startDate },
                    },
                ],
            },
        });

        if (conflictingReservation) {
            throw new Error('Date is already occupied');
        }

        const reservation = await Reservation.create({
            apartmentId: apartmentId,
            startDate: startDate,
            endDate: endDate,
            clientName: clientName,
        });
        return reservation.reservationId;
    }
    public async GetReservation(reservationId: string): Promise<Reservation> {
        this.Logger.info('Get reservation period!');

        const reservation = await Reservation.findByPk(reservationId);

        if (!reservation) throw new Error('Reservation not found');

        return reservation;
    }
    public async UpdateReservation(
        reservationId: string,
        apartmentId: string,
        userId: string,
        startDate: Date,
        endDate: Date,
        clientName: string
    ): Promise<void> {
        this.Logger.info('Updating reservation period!');

        const conflictingReservation = await Reservation.findOne({
            where: {
                apartmentId,
                reservationId: { [Op.ne]: reservationId }, // Exclude the current reservation
                [Op.or]: [
                    {
                        startDate: { [Op.lte]: endDate },
                        endDate: { [Op.gte]: startDate },
                    },
                ],
            },
        });

        if (conflictingReservation) {
            throw new Error('Date is already occupied');
        }

        await Reservation.update(
            {
                startDate: startDate,
                endDate: endDate,
                clientName: clientName,
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
