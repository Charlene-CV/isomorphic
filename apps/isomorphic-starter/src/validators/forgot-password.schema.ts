import { z } from 'zod';
import { validateEmail } from './common-rules';

// form zod validation schema
export const forgotPasswordSchema = z.object({
  email: validateEmail,
});

// generate form types from zod validation schema
export type forgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;
