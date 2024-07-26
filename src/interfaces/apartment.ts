import { z } from 'zod';

export const NewApartmentDTO = z.object({
    name: z.string().min(2).max(50),
    address: z.string().min(2).max(80),
    lat: z.coerce.number(),
    lng: z.coerce.number(),
});
export const NewAboutUsDTO = z.object({
    moto: z.string().min(2).max(100),
    aboutUs: z.string().min(2).max(1000),
    titleImage: z.coerce.number().min(0),
    apartmentId: z.string().uuid(),
});
export const UpdateAboutUsDTO = z.object({
    moto: z.string().min(2).max(100),
    aboutUs: z.string().min(2).max(1000),
    titleImage: z.union([z.coerce.number().min(0), z.string()]),
    imagesUrlArray: z.optional(z.array(z.string())),
});
export const ParamApartmentUUID = z.object({ apartmentId: z.string().uuid() });
