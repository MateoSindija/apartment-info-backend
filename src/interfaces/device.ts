import { z } from 'zod';

export const NewDeviceDTO = z.object({
    title: z.string().min(2).max(50),
    description: z.string().min(2).max(1000),
    apartmentId: z.string().uuid(),
    titleImage: z.coerce.number().min(0),
});
export const UpdateDeviceDTO = z.object({
    title: z.string().min(2).max(50),
    description: z.string().min(2).max(1000),
    titleImage: z.union([z.coerce.number().min(0), z.string()]),
    imagesUrlArray: z.optional(z.array(z.string())),
});

export const ParamDeviceUUID = z.object({
    deviceId: z.string().uuid(),
});
