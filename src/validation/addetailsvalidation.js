import { z } from 'zod'

export const detailSchema = z.object({
    addressOne: z.string().min(1, "Address 1 is required"),
    addressTwo: z.string().optional(),
    state: z.string().min(1, "State is required"),
    city: z.string().min(1, "City is required"),
    phone: z.string()
      .min(10, "Phone number should be at least 10 digits")
      .regex(/^[0-9]+$/, "Phone number should contain only digits"),
    caption: z.string().min(1, "Caption is required"),
})