import { z } from 'zod';

export const NewReservationDTO = z.object({
    startDate: z.coerce.date().min(new Date()),
    endDate: z.coerce.date().min(new Date()),
    apartmentId: z.string().uuid(),
});
export const UpdateReservationDTO = z.object({
    startDate: z.coerce.date().min(new Date()),
    endDate: z.coerce.date().min(new Date()),
});
export const ReservationParamsUUID = z.object({
    reservationId: z.string().uuid(),
});
