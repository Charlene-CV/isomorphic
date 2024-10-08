import { z } from 'zod';
import {
  BillingOptionsEnum,
  CustomerServiceTypeEnum,
  CustomerTypesEnum,
  LiveLocationEnum,
} from '@/config/constants';

const addressSchema = z.object({
  address: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  postal: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

const businessHoursSchema = z.object({
  open: z.date(),
  close: z.date(),
});

export const createCustomerSchema = z.object({
  name: z.string().min(1),
  shortCode: z.string().min(1),
  customerType: z.nativeEnum(CustomerTypesEnum).optional(),
  billingOption: z.nativeEnum(BillingOptionsEnum).optional(),
  requireQuote: z.boolean(),
  currency: z.string().min(1),
  isActive: z.boolean(),
  addresses: addressSchema.nullable(),
});

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;

export const updateCustomerSchema = z.object({
  name: z.string().min(1),
  shortCode: z.string().min(1),
  customerType: z.nativeEnum(CustomerTypesEnum),
  billingOption: z.nativeEnum(BillingOptionsEnum),
  requireQuote: z.boolean(),
  currency: z.string().min(1),
  isActive: z.boolean(),
  addresses: addressSchema.nullable(),
  balance: z.number().nullable().optional(),
  creditLimit: z.number().nullable().optional(),
  externalId: z.string().nullable().optional(),
  quickbookId: z.string().nullable().optional(),
  requireDimensions: z.boolean(),
  hasPortalAccess: z.boolean(),
  liveLocation: z.nativeEnum(LiveLocationEnum),
  businessHours: businessHoursSchema.nullable(),
  notes: z.string().nullable().optional(),
  serviceType: z.nativeEnum(CustomerServiceTypeEnum),
  contactName: z.string().nullable().optional(),
  contactEmail: z.string().nullable().optional(),
  contactPhone: z.string().nullable().optional(),
  accessorialUuids: z.array(z.string()).optional(),
  tagsUuids: z.array(z.string()).optional(),
});

export type UpdateCustomerSchema = z.infer<typeof updateCustomerSchema>;
