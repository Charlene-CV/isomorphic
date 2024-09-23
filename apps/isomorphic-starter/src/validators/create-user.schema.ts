import { z } from 'zod';
import { messages } from '@/config/messages';
import { validateEmail } from './common-rules';

// form zod validation schema
export const createUserSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: validateEmail,
  roleUuid: z.string().min(1, { message: messages.roleIsRequired }),
});

// generate form types from zod validation schema
export type CreateUserInput = z.infer<typeof createUserSchema>;

const insuranceSchema = z.object({
  companyName: z.string().min(1, { message: 'Company name is required' }),
  licenseExpireAt: z.date().refine((date) => date > new Date(), {
    message: 'License expiration date must be a future date',
  }),
  insurancePolicy: z
    .string()
    .min(1, { message: 'Insurance policy is required' }),
  expiryWarning: z.boolean(),
});

export const updateUserSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().nullable().optional(),
  email: z.string().email({ message: 'Invalid email address' }),
  // externalId: z.string().nullable().optional(),
  // quickbookId: z.string().nullable().optional(),
  // phone: z.string().nullable().optional(),
  // grossRevenu: z.number().nullable().optional(),
  // grossMargin: z.number().nullable().optional(),
  // flatRate: z.number().nullable().optional(),
  // fastCard: z.string().nullable().optional(),
  // fuelCardNumber: z.string().nullable().optional(),
  // notes: z.string().nullable().optional(),
  // mobile: z.string().nullable().optional(),
  // driverType: z.string().nullable().optional(),
  // payType: z.string().nullable().optional(),
  // fuelDeduction: z.string().nullable().optional(),
  // paymentSchedule: z.string().nullable().optional(),
  // insurance: insuranceSchema.nullable().optional(),
  isActive: z.boolean().optional(),
  roleUuid: z.string(),
});

// generate form types from zod validation schema
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
