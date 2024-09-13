import { z } from 'zod';

// form zod validation schema
export const tagFormSchema = z.object({
  name: z.string().min(1, { message: "Tag name is required." }),
  icon: z.string(),
  isActive: z.boolean(),
  uuid: z.string()
});

// generate form types from zod validation schema
export type TagFormInput = z.infer<typeof tagFormSchema>;
