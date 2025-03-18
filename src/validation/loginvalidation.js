import { z } from 'zod'

export const loginSchema = z.object({
    email: z
    .string({ required_error: 'Email is required' })
    .email('Invalid email')
    .nonempty("Email Required"),

    password : z
    .string({ required_error: 'Password is required' })
    .min(7, 'Password must be at least 7 characters')
    .nonempty("Password Required")
})