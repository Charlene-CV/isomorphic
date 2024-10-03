import { z } from 'zod';

export const createAccessorialSchema = z.object({
  name: z.string(),
  legType: z.string(),
  basePrice: z.number().optional(),
  requiredEquipment: z.boolean(),
  categoryUuid: z.string(),
  tagsUuids: z.array(z.string()).optional(),
});

export type CreateAccessorialInput = z.infer<typeof createAccessorialSchema>;
