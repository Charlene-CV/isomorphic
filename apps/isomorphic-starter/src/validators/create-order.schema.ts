import { z } from "zod";

// form zod validation schema
export const customerFormSchema = z.object({
  uuid: z.string(),
  billingParty: z.object({
    name: z.string().min(1, { message: "Billing party name is required." }),
    shortCode: z.string().min(1, { message: "Short code is required." }),
    customerType: z.enum(["shipper", "otherType"]),
    billingOption: z.enum(["shipper", "otherOption"]),
    requireQuote: z.boolean(),
    currency: z.string().min(1, { message: "Currency is required." }),
    isActive: z.boolean(),
    addresses: z.object({
      city: z.string().min(1, { message: "City is required." }),
      state: z.string().min(1, { message: "State is required." }),
      postal: z.string().min(1, { message: "Postal code is required." }),
      address: z.string().min(1, { message: "Address is required." }),
      country: z.string().min(1, { message: "Country is required." }),
      latitude: z.number(),
      longitude: z.number(),
    }),
  }),
});

// generate form types from zod validation schema
export type CustomerFormInput = z.infer<typeof customerFormSchema>;
