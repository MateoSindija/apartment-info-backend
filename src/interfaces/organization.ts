import { z } from 'zod';

export const NewOrganizationDTO = z.object({
    name: z.string().min(2).max(50),
});

export const OrganizationParamUUID = z.object({
    organizationId: z.string().uuid(),
});
