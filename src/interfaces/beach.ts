import { z } from 'zod';

export const NewBeachDTO = z.object({
    title: z.string().min(2).max(50),
    description: z.string().min(2).max(1000),
    lat: z.coerce.number().min(-90).max(90),
    lng: z.coerce.number().min(-90).max(90),
    terrainType: z.string(),
    titleImage: z.coerce.number().min(0),
    apartmentId: z.string().uuid(),
});
export const UpdateBeachDTO = z.object({
    title: z.string().min(2).max(50),
    description: z.string().min(2).max(1000),
    lat: z.coerce.number().min(-90).max(90),
    lng: z.coerce.number().min(-90).max(90),
    terrainType: z.string(),
    titleImage: z.union([z.coerce.number().min(0), z.string()]),
    imagesUrlArray: z.optional(z.array(z.string())),
});

export const ParamBeachUUID = z.object({
    beachId: z.string().uuid(),
});
