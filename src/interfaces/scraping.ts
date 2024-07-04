import { z } from 'zod';

export const NewScrapingUrlDTO = z.object({
    siteUrl: z.string().url(),
    apartmentId: z.string().uuid(),
});
