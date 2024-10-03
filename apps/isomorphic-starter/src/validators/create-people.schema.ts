import { z } from 'zod';

export const createPeopleSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().min(1),
  job: z.string().optional(),
  notes: z.string().optional(),
  sendInvoices: z.boolean(),
  sendReports: z.boolean(),
  hasPortalAccess: z.boolean(),
  customerUuid: z.string().min(1),
});

export const updatePeopleSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().min(1),
  job: z.string().optional(),
  notes: z.string().optional(),
  sendInvoices: z.boolean(),
  sendReports: z.boolean(),
  hasPortalAccess: z.boolean(),
  isActive: z.boolean(),
  customerUuid: z.string().min(1),
  status: z.string().min(1),
});

export type CreatePeopleInput = z.infer<typeof createPeopleSchema>;

export type UpdatePeopleInput = z.infer<typeof updatePeopleSchema>;
