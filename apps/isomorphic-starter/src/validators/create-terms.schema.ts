import { z } from 'zod';

// form zod validation schema
export const termsFormSchema = z.object({
  name: z.string().min(1, { message: 'Tag name is required.' }),
  numberOfDays: z.number(),
  uuid: z.string(),
});

// generate form types from zod validation schema
export type TermFormInput = z.infer<typeof termsFormSchema>;
