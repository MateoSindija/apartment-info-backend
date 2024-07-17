import { z } from 'zod';

export const NewApartmentDTO = z.object({
    name: z.string().min(2).max(50),
    address: z.string().min(2).max(80),
    lat: z.coerce.number(),
    lng: z.coerce.number(),
});
export const ParamApartmentUUID = z.object({ apartmentId: z.string().uuid() });
