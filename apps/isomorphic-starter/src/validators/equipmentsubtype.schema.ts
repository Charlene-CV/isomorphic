import { z } from 'zod';

// form zod validation schema
export const equipSubTypeFormSchema = z.object({
  uuid: z.string(),
  name: z.string().min(1, { message: "Equipment subtype name is required." }),
  typeuuid: z.string()
});

// generate form types from zod validation schema
export type EquipSubTypeFormInput = z.infer<typeof equipSubTypeFormSchema>;