import { z } from 'zod';

// form zod validation schema
export const equipFormSchema = z.object({
  uuid: z.string(),
  name: z.string().min(1, { message: "Equipment name is required." }),
  status: z.string(),
  description: z.string().nullable(),
  externalId: z.string().nullable(),
  isBillable: z.boolean(),
  isIftaTracking: z.boolean(),
  vin: z.string().nullable(),
  payAmount: z.number().nullable(),
  specifications: z.object({
    length: z.number(),
    width: z.number(),
    height: z.number(),
    weight: z.number(),
    capacity: z.number(),
    units: z.string(),
  }).nullable(),
  licenses: z.array(z.object({
    number: z.string(),
    type: z.string(),
    licensingBody: z.string(),
    issued: z.string(),
    expiry: z.string().nullable(),
  })).nullable(),
  managerUuid: z.string().nullable(),
  driverUuid: z.string().nullable(),
  typeUuid: z.string(),
  subTypeUuid: z.string().nullable(),
  paymentTypeUuid: z.string().nullable()
});

// generate form types from zod validation schema
export type EquipFormInput = z.infer<typeof equipFormSchema>;
