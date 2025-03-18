import { z } from "zod";

export const otpSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required"),
  otp: z
    .string()
    .length(6, "OTP must be 6 characters")
    .nonempty("OTP is required"),
});
