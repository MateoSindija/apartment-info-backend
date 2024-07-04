import { z } from 'zod';
export const NewReviewDTO = z.object({
    comfortRating: z.coerce.number().min(1).max(5),
    experienceRating: z.coerce.number().min(1).max(5),
    valueRating: z.coerce.number().min(1).max(5),
    apartmentId: z.string().uuid(),
    review: z
        .string()
        .min(4, 'Please enter a valid value')
        .max(1000)
        .optional()
        .or(z.literal('')),
});
