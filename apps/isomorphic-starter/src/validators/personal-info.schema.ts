import { z } from 'zod';
import { messages } from '@/config/messages';
import { fileSchema, validateEmail } from './common-rules';

// form zod validation schema
export const personalInfoFormSchema = z.object({
  firstName: z.string().min(1, { message: messages.firstNameRequired }),
  lastName: z.string().optional(),
  email: validateEmail,
  phone: z.string().regex(/^\d{3}-\d{3}-\d{4}$/, "Phone number must be in the format XXX-XXX-XXXX")
});

// generate form types from zod validation schema
export type PersonalInfoFormTypes = z.infer<typeof personalInfoFormSchema>;

export const defaultValues = {
  firstName: '',
  lastName: undefined,
  email: '',
  phone: undefined
};
