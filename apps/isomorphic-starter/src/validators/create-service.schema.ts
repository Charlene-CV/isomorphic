import { ServiceConnectionEnum } from '@/config/constants';
import { z } from 'zod';

export const createServiceSchema = z.object({
  name: z.string(),
  offering: z.string(),
  minMarkup: z.number().optional(),
  maxMarkup: z.number().optional(),
  markup: z.number().optional(),
  isActive: z.boolean(),
  typeUuid: z.string(),
  connection: z.nativeEnum(ServiceConnectionEnum),
});

export type CreateServiceInput = z.infer<typeof createServiceSchema>;
