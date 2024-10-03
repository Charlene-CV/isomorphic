import { z } from "zod";

// form zod validation schema
export const carrierFormSchema = z.object({
  uuid: z.string(),
  name: z.string().min(1, { message: "Carrier name is required." }),
  dotId: z.string().nullable(),
  currency: z.string().min(1, { message: "Currency is required." }),
  addresses: z
    .array(
      z.object({
        address: z.string().nullable(),
        city: z.string().nullable(),
        state: z.string().nullable(),
        postal: z.string().nullable(),
        country: z.string().nullable(),
        latitude: z.number(),
        longitude: z.number(),
      })
    )
    .min(1, { message: "At least one address is required." }),
});

// generate form types from zod validation schema
export type CarrierFormInput = z.infer<typeof carrierFormSchema>;
