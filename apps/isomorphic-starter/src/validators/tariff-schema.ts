import { TariffTypes } from '@/config/constants';
import { z } from 'zod';

export const createTariffSchema = z.object({
  name: z.string().min(1),
  type: z.nativeEnum(TariffTypes),
  customerUuid: z.string().min(1),
});

export type CreateTariffInput = z.infer<typeof createTariffSchema>;

export const updateTariffSchema = z.object({
  name: z.string().min(1),
  type: z.nativeEnum(TariffTypes),
  notes: z.string().optional(),
  fuelTable: z.string().min(1),
  basePerc: z.number().nullable().optional(),
  adjustmentPerc: z.number().nullable().optional(),
  ratePerc: z.number().nullable().optional(),
  rangMultiplier: z.number(),
  startDate: z.date().nullable().optional(),
  endDate: z.date().nullable().optional(),
  isActive: z.boolean(),
  isImporting: z.boolean(),
  customerUuid: z.string().min(1),
  accessorialUuids: z.array(z.string()).nullable().optional(),
});

export type UpdateTariffInput = z.infer<typeof updateTariffSchema>;
