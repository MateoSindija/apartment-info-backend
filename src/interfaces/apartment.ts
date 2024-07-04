import { z } from 'zod';

export const NewApartmentDTO = z.object({
    name: z.string().min(2).max(50),
    address: z.string().min(2).max(80),
    description: z.string().min(2).max(1000),
    lat: z.coerce.number(),
    lng: z.coerce.number(),
    organizationId: z.string().uuid(),
});
export const ParamApartmentUUID = z.object({ apartmentId: z.string().uuid() });
