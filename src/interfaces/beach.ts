import { z } from 'zod';

export const NewBeachDTO = z.object({
    title: z.string().min(2).max(50),
    description: z.string().min(2).max(1000),
    imagesUrl: z.array(z.string().url()),
    lat: z.number(),
    lng: z.number(),
    terrainType: z.string(),
    titleImage: z.coerce.number().min(0),
    apartmentId: z.string().uuid(),
});
export const UpdateBeachDTO = z.object({
    title: z.string().min(2).max(50),
    description: z.string().min(2).max(1000),
    imagesUrl: z.array(z.string().url()),
    lat: z.number(),
    lng: z.number(),
    terrainType: z.string(),
    titleImage: z.string(),
});

export const ParamBeachUUID = z.object({
    beachId: z.string().uuid(),
    apartmentId: z.string().uuid(),
});
