import { z } from 'zod';

// form zod validation schema
export const roleFormSchema = z.object({
  uuid: z.string(),
  name: z.string().min(1, { message: "Role name is required." }),
  permissions: z.array(
    z.object({
      modelUuid: z.string().min(1, { message: "Model UUID is required." }),
      write: z.boolean(),
      edit: z.boolean(),
      read: z.boolean(),
      delete: z.boolean(),
    })
  ).min(1, { message: "At least one permission is required." }),
});

// generate form types from zod validation schema
export type RoleFormInput = z.infer<typeof roleFormSchema>;
