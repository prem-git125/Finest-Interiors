import { z } from 'zod'

export const updatepassSchema = z.object({
    newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .nonempty("Password Required"),

    otp: z
      .string()
      .length(6, "OTP must be 6 characters")
      .nonempty("OTP is required"),
  });