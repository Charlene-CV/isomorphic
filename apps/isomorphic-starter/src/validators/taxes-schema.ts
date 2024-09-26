import { z } from 'zod';

// form zod validation schema
export const taxFormSchema = z.object({
  name: z.string().min(1, { message: "Tag name is required." }),
  origin: z.string(),
  destination: z.string(),
  tax: z.number(),
  createdAt: z.date(),
  uuid: z.string()
});

// generate form types from zod validation schema
export type TaxFormInput = z.infer<typeof taxFormSchema>;
