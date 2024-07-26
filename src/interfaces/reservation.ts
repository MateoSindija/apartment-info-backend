import { z } from 'zod';

export const NewReservationDTO = z
    .object({
        clientName: z.string().min(2).max(20),
        startDate: z.coerce.date(),
        endDate: z.coerce.date(),
        apartmentId: z.string().uuid(),
    })
    .refine((data) => data.endDate > data.startDate, {
        message: 'End date must be greater than start date',
        path: ['endDate'],
    });
export const UpdateReservationDTO = z
    .object({
        clientName: z.string().min(2).max(20),
        startDate: z.coerce.date(),
        endDate: z.coerce.date(),
        apartmentId: z.string().uuid(),
    })
    .refine((data) => data.endDate > data.startDate, {
        message: 'End date must be greater than start date',
        path: ['endDate'],
    });
export const ReservationParamsUUID = z.object({
    reservationId: z.string().uuid(),
});
