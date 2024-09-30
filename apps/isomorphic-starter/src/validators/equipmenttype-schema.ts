import { z } from 'zod';

// form zod validation schema
export const equipTypeFormSchema = z.object({
  uuid: z.string(),
  name: z.string().min(1, { message: "Equipment type name is required." }),
  icon: z.string(),
  isActive: z.boolean()
});

// generate form types from zod validation schema
export type EquipTypeFormInput = z.infer<typeof equipTypeFormSchema>;
