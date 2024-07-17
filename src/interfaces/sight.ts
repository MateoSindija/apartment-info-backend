import { z } from 'zod';

export const NewSightDTO = z.object({
    title: z.string().min(2).max(50),
    description: z.string().min(2).max(1000),
    lat: z.coerce.number().min(-90).max(90),
    lng: z.coerce.number().min(-90).max(90),
    titleImage: z.coerce.number().min(0),
    apartmentId: z.string().uuid(),
});
export const UpdateSightDTO = z.object({
    title: z.string().min(2).max(50),
    description: z.string().min(2).max(1000),
    imagesUrl: z.array(z.string().url()),
    lat: z.coerce.number().min(-90).max(90),
    lng: z.coerce.number().min(-90).max(90),
    titleImage: z.string(),
});

export const ParamSightUUID = z.object({
    sightId: z.string().uuid(),
});
