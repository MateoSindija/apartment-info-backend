import { z } from 'zod';

export const NewShopDTO = z.object({
    title: z.string().min(2).max(50),
    description: z.string().min(2).max(1000),
    lat: z.coerce.number(),
    lng: z.coerce.number(),
    apartmentId: z.string().uuid(),
    titleImage: z.coerce.number().min(0),
});
export const UpdateShopDTO = z.object({
    title: z.string().min(2).max(50),
    description: z.string().min(2).max(1000),
    lat: z.coerce.number(),
    lng: z.coerce.number(),
    titleImage: z.string(),
});

export const ParamShopUUID = z.object({
    shopId: z.string().uuid(),
});
export const ImageUrlDTO = z.object({ imageUrl: z.string() });
