import { z } from 'zod';
import { messages } from '@/config/messages';

// form zod validation schema
export const typeFormSchema = z.object({
  name: z.string().min(1, { message: messages.catNameIsRequired }),
});

// generate form types from zod validation schema
export type TypeFormInput = z.infer<typeof typeFormSchema>;
