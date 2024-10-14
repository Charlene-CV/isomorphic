import { z } from 'zod';

const addressSchema = z.object({
  address: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  postal: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  latitude: z.number(),
  longitude: z.number(),
});

const businessHoursSchema = z.object({
  open: z.date().nullable(),
  close: z.date().nullable(),
});

export const customerAddressesSchema = z.object({
  company: z.string().min(1),
  contactName: z.string().optional(),
  phone: z.string().optional(),
  phoneExt: z.string().optional(),
  fax: z.string().optional(),
  email: z.string().optional(),
  businessHours: businessHoursSchema.nullable(),
  address: addressSchema.nullable(),
  externalId: z.string().nullable().optional(),
  customBroker: z.string().nullable().optional(),
  bolInstruction: z.string().nullable().optional(),
  shipperNotes: z.string().nullable().optional(),
  consigneeNotes: z.string().nullable().optional(),
  customerUuid: z.string().min(1),
  accessorialUuids: z.array(z.string()).nullable().optional(),
});

export type CustomerAddressesInput = z.infer<typeof customerAddressesSchema>;
