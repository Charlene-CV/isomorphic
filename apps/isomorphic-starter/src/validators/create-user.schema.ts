import { z } from 'zod';

// form zod validation schema
export const userFormSchema = z.object({
  uuid: z.string(),
  firstName: z.string().min(1, { message: 'First name is required.' }),
  lastName: z.string().min(1, { message: 'Last name is required.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  externalId: z.string().optional(),
  quickbookId: z.string().optional(),
  phone: z.string().min(1, { message: 'Phone number is required.' }),
  grossRevenu: z.number(),
  grossMargin: z.number(),
  flatRate: z.number(),
  fastCard: z.string().optional(),
  fuelCardNumber: z.string().optional(),
  notes: z.string().optional(),
  mobile: z.string().min(1, { message: 'Mobile number is required.' }),
  driverType: z.string().optional(),
  payType: z.string().optional(),
  fuelDeduction: z.string().optional(),
  paymentSchedule: z.string().optional(),
  insurance: z.object({
    companyName: z
      .string()
      .min(1, { message: 'Insurance company name is required.' }),
    licenseExpireAt: z
      .string()
      .min(1, { message: 'License expiration date is required.' }),
    insurancePolicy: z
      .string()
      .min(1, { message: 'Insurance policy is required.' }),
    expiryWarning: z.boolean(),
  }),
  isActive: z.boolean(),
  roleUuid: z.string().min(1, { message: 'Role UUID is required.' }),
});

// generate form types from zod validation schema
export type UserFormInput = z.infer<typeof userFormSchema>;
