import { z } from 'zod';

export const NewRestaurantDTO = z.object({
    title: z.string().min(2).max(50),
    description: z.string().min(2).max(1000),
    lat: z.coerce.number().min(-90).max(90),
    lng: z.coerce.number().min(-90).max(90),
    emailContact: z.string().email(),
    phoneContact: z.string().min(3).max(50),
    review: z.coerce.number().min(0).max(5),
    reviewAmount: z.coerce.number().min(0),
    titleImage: z.coerce.number().min(0),
});
export const UpdateRestaurantDTO = z.object({
    title: z.string().min(2).max(50),
    description: z.string().min(2).max(1000),
    lat: z.coerce.number().min(-90).max(90),
    lng: z.coerce.number().min(-90).max(90),
    terrainType: z.string(),
    titleImage: z.string(),
});

export const ParamRestaurantUUID = z.object({
    restaurantId: z.string().uuid(),
});
